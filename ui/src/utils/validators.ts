export function isValidString(value) {
  if (value === undefined || value === null) value = "";
  const isAString = /^[a-zA-Z0-9\s-]+$/.test(value);
  switch (true) {
    case value.trim() === "":
      return "Field can not be empty";
    case !isAString:
      return "Invalid Characters";
    default:
      return true;
  }
}

export function isNotEmpty(value) {
  if (value === undefined || value === null) value = "";
  if (value.trim() === "") {
    return "Field can not be empty";
  }
  return true;
}

export function isValidEmploymentNumber(value) {
  if (value === undefined || value === null) value = "";
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{8}$/.test(value);

  switch (true) {
    case value === null || value === "":
      return "Field cannot be empty";
    case !isValidNumber:
      return "Field only accepts numbers";
    case !hasValidLength:
      return "Employment number must be 8 numbers";
    default:
      return true;
  }
}

export function isValidPhoneNumber(value) {
  if (value === undefined || value === null) value = "";
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{10}$/.test(value);

  switch (true) {
    case value.trim() === "":
      return "Field cannot be empty";
    case !isValidNumber:
      return "Field only accepts numbers";
    case !hasValidLength:
      return "Please use the format xxxxxxxxxx";
    default:
      return true;
  }
}

export function isValidFundNumber(value) {
  if (value === undefined || value === null) value = "";
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{6}$/.test(value);

  switch (true) {
    case value.trim() === "":
      return "Required";
    case !isValidNumber:
      return "Numbers only";
    case !hasValidLength:
      return " 6-digits";
    default:
      return true;
  }
}

export function isValidNumber(value) {
  if (value === undefined || value === null) value = "";
  let isValidNumber = /^[0-9]+$/.test(value);

  if (!isValidNumber && String(value).trim() !== "") {
    return "Numbers only";
  }

  if (String(value).trim() === "") {
    return "Field can not be empty";
  }
  return true;
}
export function isValidFoapaAmount(value) {
  if (value === undefined || value === null) value = "";
  let isValidNumber = /^[0-9]+$/.test(value);

  if (!isValidNumber && value.trim() !== "") {
    return "Numbers only";
  }
  return true;
}

export function isValidAccountNumber(value) {
  if (value === undefined || value === null) value = "";
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{4}$/.test(value);

  switch (true) {
    case value.trim() === "":
      return "Required";
    case !isValidNumber:
      return "Numbers only";
    case !hasValidLength:
      return "4-digits";
    default:
      return true;
  }
}

//Non required foapa numebrs
export function isValidFoapaNumber(value) {
  if (value === undefined || value === null) value = "";
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{4}$/.test(value);

  switch (true) {
    case value.trim() === "":
      return true;
    case !isValidNumber:
      return "Numbers only";
    case !hasValidLength:
      return "4-digits";
    default:
      return true;
  }
}

export function isValidFoapaName(value, maxLength) {
  if (value === undefined || value === null) value = "";
  switch (true) {
    case value.trim() === "":
      return "Required";
    case value.length > maxLength:
      return "Too many characters";
    default:
      return true;
  }
}

export function isLessThan(value, maxLength: number) {
  if (value === undefined || value === null) value = "";

  if (value.length > maxLength) {
    return "Too many characters";
  } else {
    return true;
  }
}
