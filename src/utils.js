export const centerGameObjects = (objects) => {
    objects.forEach(function (object) {
        object.anchor.setTo(0.5)
    })
}

export const increase = (number, amount) => {
    const multiplier = number < 0 ? -1 : 1;
    const ret = multiplier * (Math.abs(number) + amount);
    // if the signs are different meaning we went past 0
    if (ret * number <= 0) {
        return 0;
    }
    return ret;
}


export const decrease = (number, amount) => {
    const multiplier = number <= 0 ? -1 : 1;
    return number - (multiplier * amount);
}
