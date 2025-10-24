const { networkInterfaces } = require('os');

function getLocalIpV4() {
    const nets = networkInterfaces();

    const allAddresses = Object.values(nets).flat();

    const localIp = allAddresses.find(
        (iface) => iface.family === 'IPv4' && !iface.internal
    );

    return localIp ? localIp.address : '0.0.0.0';
}

module.exports = getLocalIpV4;