import { pbkdf2Sync, randomBytes } from "crypto";

const isUUID = (uuid: string) => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

const passwordCrypt = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return {
    salt,
    hash,
  };
};

export { isUUID, passwordCrypt };
