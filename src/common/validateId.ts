export default function validateId(id: string) {
  const regex = new RegExp(/^[0-9a-fA-F]{24}$/);
  return regex.test(id);
}
