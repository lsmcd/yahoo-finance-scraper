const pattern = /(1?[0-2]:[0-5]\d:[0-5]\d) (PM|AM) (EST|UTC(\+|-)(1?\d))/g;

function timestamp(timestamp: string): Date {
  if (timestamp.match(pattern)) {
    return new Date();
  }
  throw new Error("Invalid timestamp");
}

export default timestamp;
