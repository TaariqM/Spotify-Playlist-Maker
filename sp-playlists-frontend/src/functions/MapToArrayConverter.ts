function mapToArrayConverter(map: Map<string, any[]>): any[] {
  const entries = map.entries();
  let arrayOfEntries: any[] = [];

  for (let entry of entries) {
    arrayOfEntries.push(entry);
  }
  return arrayOfEntries;
}

export default mapToArrayConverter;
