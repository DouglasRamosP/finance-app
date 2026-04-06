const normalizeRangeBoundary = (value, endOfDay = false) => {
    const date = value instanceof Date ? new Date(value) : new Date(value)

    if (Number.isNaN(date.getTime())) {
        return date
    }

    if (endOfDay) {
        date.setUTCHours(23, 59, 59, 999)
        return date
    }

    date.setUTCHours(0, 0, 0, 0)
    return date
}

export const buildInclusiveDateRange = (from, to) => {
    return {
        gte: normalizeRangeBoundary(from),
        lte: normalizeRangeBoundary(to, true),
    }
}
