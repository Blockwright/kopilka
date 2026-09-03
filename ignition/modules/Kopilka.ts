// ignition/modules/Kopilka.ts — деплой как код (пост 11/20)
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

export default buildModule("KopilkaModule", (m) => {
  // цель копилки; переопределяется параметром при деплое
  const goal = m.getParameter("goal", parseEther("0.001"));
  return { kopilka: m.contract("Kopilka", [goal]) };
});
