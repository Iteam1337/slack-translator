const suspendedChannels = new Set();

function getSuspendedChannels () {
  return suspendedChannels;
}

function suspendChannels (channel, timeout) {
  suspendedChannels.add(channel);
  setTimeout(() => suspendedChannels.delete(channel), timeout);
}

export default {getSuspendedChannels, suspendChannels};
