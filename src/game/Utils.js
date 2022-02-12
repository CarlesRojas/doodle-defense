export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function degToRad(deg) {
    return (deg * Math.PI) / 180;
}

export function radToDeg(rad) {
    return (rad * 180) / Math.PI;
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
