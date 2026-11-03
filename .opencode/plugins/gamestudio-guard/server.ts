import { Plugin } from "@opencode/plugin"

// GameStudio guard: the deterministic safety rule from .agents/hooks.json
// that can be enforced at the tool boundary. Secret-bearing files are never
// written by an agent; project conventions and approvals stay in the prompt.
export default Plugin.define({
  id: "gamestudio.guard",
  async setup(ctx) {
    await ctx.tool.hook("execute.before", (event) => {
      const tool = event.tool
      if (tool !== "edit" && tool !== "write" && tool !== "patch") return
      const input = event.input as { filePath?: string; path?: string }
      const p = input.filePath ?? input.path ?? ""
      const base = p.split("/").pop() ?? ""
      const safeTemplates = new Set([".env.example", ".env.sample", ".env.template", ".env.dist", ".env.defaults"])
      const isSecretEnv = base === ".env" || (base.startsWith(".env.") && !safeTemplates.has(base))
      if (isSecretEnv) {
        throw new Error("GameStudio: refusing to write environment files")
      }
    })
  },
})
