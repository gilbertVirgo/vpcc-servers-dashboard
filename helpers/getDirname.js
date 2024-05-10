import { dirname } from "path";
import { fileURLToPath } from "url";

export default (importMetaURL) => dirname(fileURLToPath(importMetaURL));
