export default function toMb (bytes) {
  bytes = parseInt(bytes || 0, 10)
  return Math.floor(bytes / 1024 / 1024) + 'mb'
}
