import validator from "validator";

/**
 * Validate email address
 * @param email - Email to validate
 * @returns True if valid email
 */
export function validateEmail(email: string): boolean {
  return validator.isEmail(email);
}

/**
 * Validate phone number (Vietnamese format)
 * @param phone - Phone number to validate
 * @returns True if valid phone
 */
export function validatePhoneVN(phone: string): boolean {
  const vnPhoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
  return vnPhoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Validation result with strength level
 */
export function validatePassword(password: string): {
  isValid: boolean;
  strength: "weak" | "medium" | "strong";
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Mật khẩu phải có ít nhất 8 ký tự");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 chữ hoa");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 chữ thường");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 số");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 ký tự đặc biệt");
  }

  let strength: "weak" | "medium" | "strong" = "weak";
  if (errors.length === 0) strength = "strong";
  else if (errors.length <= 2) strength = "medium";

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}
