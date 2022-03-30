import { config } from "dotenv";
import path from "path";

process.env.NODE_ENV = "test";
config({ path: path.resolve(__dirname, "../../.env.test") });
