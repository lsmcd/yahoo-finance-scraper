const pattern =
  /((1?[0-2]):([0-5]\d):([0-5]\d)) (PM|AM) (EST|(GMT|UTC)(\+|-)(1?\d))/g;

function timestamp(timestamp: string): Date {
  const groups = pattern.exec(timestamp);
  if (groups) {
    if (groups[6] === "EST") {
      console.log();
    }
    return new Date();
  }
  throw new Error("Invalid timestamp");
}
timestamp("12:00:00 AM EST");

export default timestamp;
