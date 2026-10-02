/* ============================================================================
 * iskill-huggingface-ext · 落地页内容
 * 事实来源：SKILL.md / README.md
 *           scripts/migrate.sh（macOS/Linux，osascript 弹框）
 *           scripts/migrate.ps1（Windows，SymbolicLink → 失败降级 Junction）
 * platform: "mac-windows"（双实现，全仓库最好的跨平台范例）
 * ==========================================================================*/
window.PROMO = {
  name: "ISKILL-HUGGINGFACE-EXT",
  brand: "#2563eb",
  brand2: "#fbbf24",
  repo: "https://github.com/aispin/iskill-huggingface-ext",
  repoLabel: "aispin/iskill-huggingface-ext",

  platform: "mac-windows",
  license: "许可见仓库",

  lang: {
    zh: {
      meta: {
        title: "ISKILL-HUGGINGFACE-EXT · 把 HF 缓存搬出系统盘",
        description: "把 ~/.cache/huggingface/hub 迁到任意目录再软链回去，HuggingFace 无感知。macOS/Linux 用 migrate.sh，Windows 用 migrate.ps1，无权限自动降级 Junction。"
      },
      a11y: { skip: "跳到主要内容" },
      ui: { copy: "复制", copied: "已复制", failed: "复制失败" },
      nav: { features: "能力", shots: "截图", how: "上手", faq: "问答" },

      hero: {
        badge: "AI 技能",
        titlePre: "把 HF 缓存搬出系统盘，",
        titleAccent: "HuggingFace 无感知",
        titlePost: "",
        sub: "把 ~/.cache/huggingface/hub 迁到移动硬盘或大 SSD，再把原路径软链回去。同一套流程：macOS / Linux 用 migrate.sh，Windows 用 migrate.ps1。",
        ctaPrimary: "复制安装提示词",
        ctaSecondary: "看源码",
        meta1: "macOS / Linux / Windows",
        meta2: "双实现",
        meta3: "零依赖"
      },
      terminal: {
        title: "zsh — iskill-huggingface-ext",
        lines: [
          [{ t: "$ ", c: "p" }, { t: "bash scripts/migrate.sh -n /Volumes/Big/hf-hub", c: "k" }, { t: "   # DryRun 预览", c: "c" }],
          [{ t: "✓ ", c: "p" }, { t: "(DryRun) 将把 ~/.cache/huggingface/hub 移动到 /Volumes/Big/hf-hub", c: "s" }],
          [{ t: "$ ", c: "p" }, { t: "pwsh scripts/migrate.ps1 -Target D:\\hf-hub", c: "k" }, { t: "        # Windows", c: "c" }],
          [{ t: "✓ ", c: "p" }, { t: "已完成（已降级为 Junction 目录连接点，读取无差异）", c: "s" }]
        ]
      },

      stats: [
        { value: "2 份实现", label: "一套流程两种系统", note: "migrate.sh（macOS/Linux）+ migrate.ps1（Windows）" },
        { value: "3 级", label: "源目录解析优先级", note: "HF_HUB_CACHE → HF_HOME/hub → ~/.cache/huggingface/hub" },
        { value: "0", label: "代码 / 环境变量要改", note: "软链建好后 HF 仍按原路径读取" },
        { value: "Junction", label: "Windows 无权限降级", note: "符号链接失败自动回退目录连接点" }
      ],

      compare: {
        eyebrow: "对比",
        title: "硬搬 vs 一键移库",
        sub: "",
        before: {
          title: "系统盘越用越满",
          items: [
            "HF 缓存默认全塞在 ~/.cache，模型一多就爆盘",
            "手工 mv 之后 HF 找不到路径，还得改环境变量",
            "Windows 直接搬完就报错，软链根本建不出来"
          ]
        },
        after: {
          title: "一键移库",
          items: [
            "migrate.sh / migrate.ps1 一条命令搬走",
            "原路径软链回去，HF 无感知、零改代码",
            "Windows 无权限自动降级 Junction，照样能读"
          ]
        }
      },

      features: {
        eyebrow: "能力",
        title: "它能做什么",
        sub: "",
        items: [
          { icon: "monitor", title: "双实现，跨平台一致", desc: "macOS / Linux 用 migrate.sh，Windows 用 migrate.ps1，两者行为完全一致。" },
          { icon: "layers", title: "按 HF 规则解析源目录", desc: "优先级 HF_HUB_CACHE → HF_HOME/hub → ~/.cache/huggingface/hub，与 HuggingFace 自身一致。" },
          { icon: "grid", title: "弹框选目录", desc: "不传目标时弹系统文件夹选择框——macOS 用 osascript，Windows 用 FolderBrowserDialog，弹不出回退手输。" },
          { icon: "shield", title: "幂等 + 防重复", desc: "源不存在提示无需迁移；源已是软链提示已迁移过并退出，不会重复搬。" },
          { icon: "bolt", title: "Windows Junction 降级", desc: "建符号链接遇权限不足（未开开发者模式 / 未提权）时自动回退 Junction，HF 读取无差异。" },
          { icon: "check", title: "支持 DryRun 预览", desc: "-n / -DryRun 只打印将要执行的操作，确认无误再真跑。" }
        ]
      },

      showcase: {
        eyebrow: "实拍",
        title: "看一眼真东西",
        sub: "",
        items: []
      },

      steps: {
        eyebrow: "上手",
        title: "三步跑起来",
        sub: "",
        items: [
          { title: "交给 AI 装", desc: "把这句话粘进对话框，agent 会自己拉代码、读文档，再告诉你用法。", codeKey: "install" },
          { title: "先预览（macOS / Linux）", desc: "DryRun 不实际移动，确认目标路径无误。", codeName: "bash", code: "bash scripts/migrate.sh -n /Volumes/Big/hf-hub" },
          { title: "Windows 指定目标盘", desc: "PowerShell 里跑，同样一步到位。", codeName: "powershell", code: "pwsh scripts/migrate.ps1 -Target D:\\hf-hub" }
        ]
      },

      faq: {
        eyebrow: "问答",
        title: "常见问题",
        items: [
          { q: "迁移后要让 HuggingFace 改配置吗？", a: "不用。原路径 <code>~/.cache/huggingface/hub</code> 变成指向目标的软链接，HF 仍按原路径读取，代码和环境变量都不用动。" },
          { q: "Windows 上软链接建不起来？", a: "正常。未开开发者模式 / 未提权时 <code>New-Item SymbolicLink</code> 会失败，脚本自动降级为 <b>Junction（目录连接点）</b>，对 HuggingFace 读取无差异。" },
          { q: "想换一个位置怎么办？", a: "先删掉软链接（<code>rm ~/.cache/huggingface/hub</code>），再重新跑一次 migrate 即可。" },
          { q: "会误删我的模型吗？", a: "流程是先「移动」数据、再删空的原目录、最后建软链；若目标已存在且非空，会先问你是否覆盖，确认才动。迁移前请确认目标盘已挂载、空间充足。" },
          { q: "跨盘 / 外置硬盘有坑吗？", a: "有。跨盘软链指向的外置硬盘卸载后，访问原路径会失败——这是软链的正常行为，重插硬盘即恢复。" },
          { q: "要装什么依赖？", a: "零第三方依赖：macOS / Linux 只要 bash，Windows 只要 PowerShell（pwsh）；不需要 Python 或 npm。" }
        ]
      },

      cta: { title: "把系统盘腾出来", desc: "粘一下安装提示词，先 DryRun 预览再放心迁移。", primary: "去 GitHub 看看", secondary: "复制安装提示词" },
      footer: { license: "许可见仓库", madeWith: "由 iskill-promo-page 生成" }
    },

    en: {
      meta: {
        title: "ISKILL-HUGGINGFACE-EXT · Move your HF cache off the system disk",
        description: "Migrate ~/.cache/huggingface/hub anywhere and symlink it back, invisibly to HuggingFace. migrate.sh on macOS/Linux, migrate.ps1 on Windows, with automatic Junction fallback."
      },
      a11y: { skip: "Skip to content" },
      ui: { copy: "Copy", copied: "Copied", failed: "Copy failed" },
      nav: { features: "Features", shots: "Screens", how: "Get started", faq: "FAQ" },

      hero: {
        badge: "AI skill",
        titlePre: "Move your HF cache off the system disk — ",
        titleAccent: "invisibly to HuggingFace",
        titlePost: "",
        sub: "Migrate ~/.cache/huggingface/hub to an external drive or big SSD, then symlink the original path back. One flow: migrate.sh on macOS / Linux, migrate.ps1 on Windows.",
        ctaPrimary: "Copy install prompt",
        ctaSecondary: "View source",
        meta1: "macOS / Linux / Windows",
        meta2: "Two implementations",
        meta3: "Zero deps"
      },
      terminal: {
        title: "zsh — iskill-huggingface-ext",
        lines: [
          [{ t: "$ ", c: "p" }, { t: "bash scripts/migrate.sh -n /Volumes/Big/hf-hub", c: "k" }, { t: "   # DryRun preview", c: "c" }],
          [{ t: "✓ ", c: "p" }, { t: "(DryRun) would move ~/.cache/huggingface/hub to /Volumes/Big/hf-hub", c: "s" }],
          [{ t: "$ ", c: "p" }, { t: "pwsh scripts/migrate.ps1 -Target D:\\hf-hub", c: "k" }, { t: "        # Windows", c: "c" }],
          [{ t: "✓ ", c: "p" }, { t: "done (fell back to a Junction directory link, reads identically)", c: "s" }]
        ]
      },

      stats: [
        { value: "2 impls", label: "one flow, two systems", note: "migrate.sh (macOS/Linux) + migrate.ps1 (Windows)" },
        { value: "3 levels", label: "source resolution order", note: "HF_HUB_CACHE → HF_HOME/hub → ~/.cache/huggingface/hub" },
        { value: "0", label: "code / env vars to change", note: "HF keeps reading the original path" },
        { value: "Junction", label: "Windows fallback", note: "symlink failure drops to a directory junction" }
      ],

      compare: {
        eyebrow: "Comparison",
        title: "Dragging it over vs one command",
        sub: "",
        before: {
          title: "A system disk filling up",
          items: [
            "HF cache defaults to ~/.cache — a few models and it is full",
            "Manually mv it and HF loses the path; now you edit env vars",
            "On Windows the move just errors out; the symlink never gets made"
          ]
        },
        after: {
          title: "One-command migration",
          items: [
            "migrate.sh / migrate.ps1 move it in a single command",
            "Symlinked back, so HF is unaware and no code changes",
            "On Windows, no permission means an automatic Junction fallback"
          ]
        }
      },

      features: {
        eyebrow: "Features",
        title: "What it does",
        sub: "",
        items: [
          { icon: "monitor", title: "Two impls, same behaviour", desc: "migrate.sh on macOS / Linux and migrate.ps1 on Windows behave exactly the same." },
          { icon: "layers", title: "HF-compatible source order", desc: "Resolution follows HF_HUB_CACHE → HF_HOME/hub → ~/.cache/huggingface/hub, matching HuggingFace itself." },
          { icon: "grid", title: "Folder picker", desc: "With no target it pops a system folder dialog — osascript on macOS, FolderBrowserDialog on Windows — falling back to manual input." },
          { icon: "shield", title: "Idempotent", desc: "No source means nothing to migrate; an already-symlinked source means it exits as already migrated, so no double moves." },
          { icon: "bolt", title: "Windows Junction fallback", desc: "If creating a symbolic link lacks permission (developer mode off / not elevated) it falls back to a Junction, read identically by HF." },
          { icon: "check", title: "DryRun preview", desc: "-n / -DryRun merely prints what would happen, so you can confirm before committing." }
        ]
      },

      showcase: {
        eyebrow: "Screens",
        title: "See the real thing",
        sub: "",
        items: []
      },

      steps: {
        eyebrow: "Get started",
        title: "Up and running in three steps",
        sub: "",
        items: [
          { title: "Let your agent install it", desc: "Paste the line into the chat — it clones the repo, reads the docs and tells you how to use it.", codeKey: "install" },
          { title: "Preview first (macOS / Linux)", desc: "DryRun moves nothing; confirm the target path is right.", codeName: "bash", code: "bash scripts/migrate.sh -n /Volumes/Big/hf-hub" },
          { title: "Windows: name the drive", desc: "Run it in PowerShell — equally a one-shot.", codeName: "powershell", code: "pwsh scripts/migrate.ps1 -Target D:\\hf-hub" }
        ]
      },

      faq: {
        eyebrow: "FAQ",
        title: "Frequently asked",
        items: [
          { q: "Do I need to reconfigure HuggingFace afterwards?", a: "No. The original <code>~/.cache/huggingface/hub</code> becomes a symlink to the target, so HF keeps reading the original path — no code or env-var changes." },
          { q: "The symlink fails on Windows?", a: "That is normal. Without developer mode / elevation, <code>New-Item SymbolicLink</code> fails and the script falls back to a <b>Junction (directory link)</b>, which HuggingFace reads identically." },
          { q: "How do I move it again later?", a: "Delete the symlink (<code>rm ~/.cache/huggingface/hub</code>) and run migrate again." },
          { q: "Can it delete my models by mistake?", a: "The flow moves data first, then removes the emptied original, then creates the link. If the target already exists and is non-empty it asks before overwriting. Make sure the target drive is mounted with enough space." },
          { q: "Any cross-drive / external-disk gotchas?", a: "Yes. Once the external drive holding a cross-drive symlink is ejected, the original path becomes inaccessible — expected symlink behaviour, restored on replug." },
          { q: "What do I need to install?", a: "Zero third-party deps: just bash on macOS / Linux and PowerShell (pwsh) on Windows — no Python or npm." }
        ]
      },

      cta: { title: "Free up your system disk", desc: "Paste the install prompt and DryRun before you commit.", primary: "Open on GitHub", secondary: "Copy install prompt" },
      footer: { license: "License: see repo", madeWith: "Built with iskill-promo-page" }
    }
  }
};
