export default function (order) {
  return `px-2 py-1 rounded-full text-center text-xs font-semibold ${order.status === 'pending'
    ? 'bg-yellow-100 text-yellow-800'
    : order.status === 'confirmed'
      ? 'bg-violet-100 text-violet-800'
      : order.status === 'shipped'
        ? 'bg-blue-100 text-blue-800'
        : order.status === 'delivered'
          ? 'bg-green-100 text-green-800'
          : order.status === 'cancelled'
            ? 'bg-red-100 text-red-800'
            : 'bg-orange-100 text-orange-800'
    }`
}