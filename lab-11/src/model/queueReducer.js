/**
 * Ред'юсер черги замовлень.
 *
 * Стан: { orders: [...] }. Кожне замовлення — як у src/data/orders.js:
 *   { id, number, status, customer: { id, name }, items: [...] }
 * status — колонка на дошці: 'new' («Нові»), 'brewing' («Готуються»),
 * 'ready' («Готові») або 'served' («Видані»).
 *
 * Дії — події на сторінці:
 *   { type: 'order_placed', order: { id, customer: { id, name }, items } }
 *       бариста надіслав нове замовлення з форми. Номер і статус 'new'
 *       дає ред'юсер, кожен напій отримує done: false. id замовлення й
 *       гостя створює обробник події.
 *   { type: 'item_toggled', orderId, itemId }
 *       бариста відмітив напій готовим або зняв позначку
 *   { type: 'order_advanced', orderId }
 *       бариста натиснув «Почати», «Готово» чи «Видати»: замовлення
 *       переходить у наступну колонку
 *   { type: 'order_cancelled', orderId }
 *       бариста натиснув «Скасувати замовлення»
 *   { type: 'customer_renamed', customerId, name }
 *       бариста виправив ім'я гостя в «Деталях»
 *
 * Компоненти й тести читають стан лише через selectColumn і selectOrder
 * унизу файлу.
 */

const nextStatus = { new: 'brewing', brewing: 'ready', ready: 'served' }

/** Початковий стан черги з вкладених замовлень, як їх повертає loadOrders(). */
export function createInitialState(orders) {
  const ordersById = {}
  const orderIds = []
  const customersById = {}
  const customerIds = []

  for (const order of orders) {
    orderIds.push(order.id)
    ordersById[order.id] = {
      id: order.id,
      number: order.number,
      status: order.status,
      customerId: order.customer.id,
      items: order.items,
    }

    if (!customersById[order.customer.id]) {
      customerIds.push(order.customer.id)
      customersById[order.customer.id] = {
        id: order.customer.id,
        name: order.customer.name,
      }
    }
  }

  const lastNumber =
    orders.length > 0 ? Math.max(...orders.map((order) => order.number)) : 0

  return {
    orders: { byId: ordersById, ids: orderIds },
    customers: { byId: customersById, ids: customerIds },
    lastNumber,
  }
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const nextNumber = state.lastNumber + 1
      const { id, customer, items } = action.order
      const order = {
        id,
        number: nextNumber,
        status: 'new',
        customerId: customer.id,
        items: items.map((item) => ({ ...item, done: false })),
      }
      const hasCustomer = Boolean(state.customers.byId[customer.id])

      return {
        ...state,
        lastNumber: nextNumber,
        orders: {
          byId: {
            ...state.orders.byId,
            [order.id]: order,
          },
          ids: [...state.orders.ids, order.id],
        },
        customers: {
          byId: {
            ...state.customers.byId,
            [customer.id]: { id: customer.id, name: customer.name },
          },
          ids: hasCustomer
            ? state.customers.ids
            : [...state.customers.ids, customer.id],
        },
      }
    }

    case 'item_toggled': {
      const order = state.orders.byId[action.orderId]
      if (!order) return state
      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: {
              ...order,
              items: order.items.map((item) =>
                item.id === action.itemId
                  ? { ...item, done: !item.done }
                  : item,
              ),
            },
          },
        },
      }
    }

    case 'order_advanced': {
      const order = state.orders.byId[action.orderId]
      if (!order) return state
      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: {
              ...order,
              status: nextStatus[order.status] ?? order.status,
            },
          },
        },
      }
    }

    case 'order_cancelled': {
      if (!state.orders.byId[action.orderId]) return state
      const remainingOrders = { ...state.orders.byId }
      delete remainingOrders[action.orderId]
      return {
        ...state,
        orders: {
          byId: remainingOrders,
          ids: state.orders.ids.filter((id) => id !== action.orderId),
        },
      }
    }

    case 'customer_renamed': {
      const customer = state.customers.byId[action.customerId]
      if (!customer) return state
      return {
        ...state,
        customers: {
          ...state.customers,
          byId: {
            ...state.customers.byId,
            [action.customerId]: {
              ...customer,
              name: action.name,
            },
          },
        },
      }
    }

    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

/**
 * Замовлення однієї колонки (status) у порядку надходження, кожне разом із
 * гостем і напоями.
 */
export function selectColumn(state, status) {
  return state.orders.ids
    .map((id) => state.orders.byId[id])
    .filter((order) => order.status === status)
    .map(({ customerId, ...rest }) => ({
      ...rest,
      customer: state.customers.byId[customerId],
    }))
}

/** Замовлення за id разом із гостем і напоями; undefined, якщо його немає. */
export function selectOrder(state, id) {
  const order = state.orders.byId[id]
  if (!order) return undefined
  const { customerId, ...rest } = order
  return {
    ...rest,
    customer: state.customers.byId[customerId],
  }
}
