export function toJSON(content) {
  const obj = {
    name: "list",
    metadata: "",
    comments: "",
    subItems: [],
  };
  const lines = content.trim().split("\n");
  for (let i = 0; i < lines.length; i++) {
    const numSpaces = lines[i].search(/\S/);
    let newItem = {
      lineNumber: i,
      order: numSpaces + "-" + i, //order
      indent: numSpaces,
      indicator: extractIndicator(lines[i]),
      name: extractName(lines[i]),
      metaData: extractMetaData(lines[i], null),
      comment: extractComments(lines[i], "//"),
      subItems: [],
    };
    findParentArray(obj.subItems, "indent", numSpaces, "subItems").push(
      newItem
    );
  }
  return obj;
}

export function toLML(obj, indent, indicator) {
  let str;
  obj.forEach((item) => {
    str +=
      item.indent +
      item.indicator +
      item.name +
      parseMetaData(item.metadata) +
      item +
      comment +
      "\n";
    if (item.subItems.length > 0) {
      toLML(item, indent, indicator);
    }
  });
  return str;
}

export function findParentArray(array, key, value, arrayKey) {
  for (let i = array.length - 1; i >= 0; i--) {
    const obj = array[i];
    if (obj[key] === value) {
      return array;
    } else if (obj[arrayKey]) {
      const result = findParentArray(obj[arrayKey], key, value, arrayKey);
      if (result) {
        return result;
      }
    }
  }
  return array;
}

export function extractComments(str, subStr) {
  const index = str.indexOf(subStr);
  if (index === -1) {
    return "";
  } else {
    return str.substring(index + subStr.length);
  }
}

export function extractName(str) {
  return str.split(/\s+/)[1];
}

export function extractIndicator(str) {
  return str.split(/\s+/)[0];
}

export function extractMetaData(str, dictionary) {
  str = str.split(/\s+/).slice(2).join(" ");
  const obj = {};
  const pairs = str.split(",");
  pairs.forEach((pair) => {
    const [key, ...values] = pair.trim().split(/\s+/);
    if (obj[key]) {
      obj[key].push(...values);
    } else {
      obj[key] = values;
    }
  });
  return obj;
}

export function getLine(str, lineNumber) {
  const lines = str.split("\n");
  if (lineNumber < 1 || lineNumber > lines.length) {
    return "";
  } else {
    return lines[lineNumber - 1];
  }
}

export function getItem(str, indent, number) {
  const re = new RegExp(`^ {${indent}}\\S`);
  const lines = str.split("\n");
  const matches = lines.filter((line) => re.test(line));

  if (number < 1 || number > matches.length) {
    return "";
  } else {
    return matches[number - 1].trim();
  }
}

export function removeComments(str, commentOpening, commentClosing) {} //single

// format
