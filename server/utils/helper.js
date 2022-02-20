const gainIntersection = (arr1, arr2) => {
    arr1.sort((a, b) => (a < b ? -1 : 1))
    arr2.sort((a, b) => (a < b ? -1 : 1))
    console.debug({
        arr1,
        arr2,
    })
    const ret = []
    let i1 = 0,
        i2 = 0
    while (i1 < arr1.length && i2 < arr2.length) {
        const v1 = arr1[i1],
            v2 = arr2[i2]
        if (v1 === v2) {
            if (ret.length === 0 || ret[ret.length - 1] !== v1) ret.push(v1)
            i1++
            i2++
        } else if (v1 < v2) i1++
        else i2++
    }
    return ret
}

const gainArr1DifferentSet = (arr1, arr2) => {
    const set = new Set()
    const ret = []
    for (const v of arr2) set.add(v)
    for (const v of arr1) if (!set.has(v)) ret.push(v)
    return ret
}

module.exports = {
    gainIntersection,
    gainArr1DifferentSet,
}
