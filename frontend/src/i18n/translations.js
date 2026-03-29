export const LANGUAGE_STORAGE_KEY = "mhobfinder:language";

export const SUPPORTED_LANGUAGES = {
  en: { code: "en", label: "English", shortLabel: "EN" },
  kh: { code: "kh", label: "ខ្មែរ", shortLabel: "KH" },
  ch: { code: "ch", label: "中文", shortLabel: "CH" },
  jp: { code: "jp", label: "日本語", shortLabel: "JP" },
};

// Helper: Route to admin title key
export function getAdminTitleKey(pathname) {
  if (pathname.includes("/admin/manage-user")) return "manageUser";
  if (pathname.includes("/admin/analytical")) return "analytical";
  if (pathname.includes("/admin/add-food")) return "addFood";
  if (pathname.includes("/admin/edit-food")) return "editFood";
  if (pathname.includes("/admin/foods")) return "foods";
  if (pathname.includes("/admin/ingredients")) return "ingredients";
  return "default";
}

export const translations = {
  // English translations
  en: {
    common: {
      language: "Language",
      searchPlaceholder: "Find...",
      translationsAria: "Translations",
      categoryLabel: "Category",
      all: "All",
      loading: "Loading...",
      cancel: "Cancel",
      ok: "OK",
    },
    start: {
      register: "Register",
      badge: "100 % free — no ads, no sign-up walls",
      heroLine1: "Cook with what",
      heroLine2: "you already have.",
      subtitle:
        "Pick the ingredients sitting in your kitchen and MhobFinder instantly shows recipes you can make — no shopping required.",
      getStarted: "Get Started",
      login: "Login",
      quickStats: {
        activeRecipes: "Active recipes",
        pantryIngredients: "Pantry ingredients",
        averageSetup: "Average setup",
      },
      previewTitle: "MhobFinder — Preview",
      yourIngredients: "Your ingredients",
      matchingRecipes: "Matching recipes",
      bestMatch: "Best match",
    },
    topBar: {
      favoritesPage: "Favorite Page",
      profilePage: "Profile Page",
      searchRecipesOrUsers: "Search recipes or users",
      adminBrand: "MhobFinder Admin",
      pantryTitle: "Pantry",
      pantryCount: "You have {count} ingredients",
      clearAllIngredients: "Clear all ingredients",
      removeAllIngredientsTitle: "Remove all ingredients?",
      removeAllIngredientsDesc: "Are you sure you want to remove all selected ingredients?",
      inputIngredient: "Input ingredient...",
      ingredientAdded: "✓ added",
      auth: {
        checking: "Checking session...",
        loggedInAs: "Logged in: {name}",
        guest: "Guest",
      },
      adminTitles: {
        manageUser: "User Management",
        analytical: "Analytics",
        addFood: "Add Food",
        editFood: "Edit Food",
        foods: "Food Library",
        ingredients: "Ingredient Management",
        default: "Admin Dashboard",
      },
    },
    home: {
      emptyTitle: "Add your ingredients to get started",
      emptySubtitle: "Every ingredient you add will unlock more recipes",
      noRecipesFound: "No recipes found",
      noRecipesHint: "Try adding more ingredients, or clear your selection.",
      clearIngredients: "Clear ingredients",
      loadingRecipes: "Loading recipes...",
      loadingHint: "Matching recipes to your ingredients.",
      recipesYouCanMake: "You can make {count} recipe{suffix}",
      doYouHave: "Do you have?",
      noRecipesInCategory: "No recipes in {category}",
      tryAnotherCategory: "Try another category.",
      categories: {
        all: "All",
        khmerFood: "Khmer Food",
        asianFood: "Asian Food",
        european: "European",
      },
    },
    about: {
      badge: "About Us",
      heroTitle: "Building Smarter Cooking with MhobFinder",
      heroDescription:
        "MhobFinder is a recipe discovery platform that helps people cook with what they already have. We focus on practical ingredient matching, clear user flows, and a polished experience that supports everyday decisions in the kitchen.",
      tryApp: "Try App",
      viewFeatures: "View Features",
      featureTitle: "Feature Highlights",
      featureDescription: "Explore some key capabilities in MhobFinder.",
      features: {
        smartMatching: "Smart Ingredient Matching",
        recipeDetails: "View Full Recipe Details",
        multiLanguage: "Multiple Language / Login with Google",
      },
      teamTitle: "Our Team Members",
      teamDescription: "Meet the people building and improving MhobFinder.",
      footer: {
        copyright: "Copyright {year} MhobFinder. All rights reserved.",
        about: "About",
        home: "Home",
      },
    },
  },

  // Khmer translations
  kh: {
    common: {
      language: "ភាសា",
      searchPlaceholder: "ស្វែងរក...",
      translationsAria: "បកប្រែ",
      categoryLabel: "ប្រភេទ",
      all: "ទាំងអស់",
      loading: "កំពុងផ្ទុក...",
      cancel: "បោះបង់",
      ok: "យល់ព្រម",
    },
    start: {
      register: "ចុះឈ្មោះ",
      badge: "ឥតគិតថ្លៃ 100% — គ្មានពាណិជ្ជកម្ម គ្មានការបង្ខំចុះឈ្មោះ",
      heroLine1: "ចម្អិនជាមួយអ្វីដែល",
      heroLine2: "អ្នកមានស្រាប់។",
      subtitle:
        "ជ្រើសរើសគ្រឿងផ្សំដែលមាននៅផ្ទះ ហើយ MhobFinder នឹងបង្ហាញមុខម្ហូបដែលអ្នកអាចធ្វើបានភ្លាមៗ។",
      getStarted: "ចាប់ផ្តើម",
      login: "ចូលគណនី",
      quickStats: {
        activeRecipes: "មុខម្ហូបសកម្ម",
        pantryIngredients: "គ្រឿងផ្សំក្នុងផ្ទះបាយ",
        averageSetup: "ពេលរៀបចំមធ្យម",
      },
      previewTitle: "MhobFinder — មើលជាមុន",
      yourIngredients: "គ្រឿងផ្សំរបស់អ្នក",
      matchingRecipes: "មុខម្ហូបដែលផ្គូផ្គង",
      bestMatch: "សមបំផុត",
    },
    topBar: {
      favoritesPage: "ទំព័រសំណព្វ",
      profilePage: "ទំព័រប្រូហ្វាល់",
      searchRecipesOrUsers: "ស្វែងរកមុខម្ហូប ឬអ្នកប្រើ",
      adminBrand: "MhobFinder អេដមិន",
      pantryTitle: "ទូរគ្រឿងផ្សំ",
      pantryCount: "អ្នកមាន {count} គ្រឿងផ្សំ",
      clearAllIngredients: "សម្អាតគ្រឿងផ្សំទាំងអស់",
      removeAllIngredientsTitle: "លុបគ្រឿងផ្សំទាំងអស់?",
      removeAllIngredientsDesc: "តើអ្នកប្រាកដថាចង់លុបគ្រឿងផ្សំដែលបានជ្រើសទាំងអស់មែនទេ?",
      inputIngredient: "បន្ថែមគ្រឿងផ្សំ...",
      ingredientAdded: "✓ បានបន្ថែម",
      auth: {
        checking: "កំពុងពិនិត្យសម័យ...",
        loggedInAs: "បានចូលជា {name}",
        guest: "ភ្ញៀវ",
      },
      adminTitles: {
        manageUser: "គ្រប់គ្រងអ្នកប្រើ",
        analytical: "វិភាគទិន្នន័យ",
        addFood: "បន្ថែមម្ហូប",
        editFood: "កែប្រែមុខម្ហូប",
        foods: "បណ្ណាល័យម្ហូប",
        ingredients: "គ្រប់គ្រងគ្រឿងផ្សំ",
        default: "ផ្ទាំងគ្រប់គ្រងអេដមិន",
      },
    },
    home: {
      emptyTitle: "បន្ថែមគ្រឿងផ្សំរបស់អ្នក ដើម្បីចាប់ផ្តើម",
      emptySubtitle: "គ្រឿងផ្សំរាល់មុខដែលអ្នកបន្ថែម នឹងបើកឱ្យឃើញមុខម្ហូបច្រើនទៀត",
      noRecipesFound: "រកមិនឃើញមុខម្ហូបទេ",
      noRecipesHint: "សូមបន្ថែមគ្រឿងផ្សំបន្ថែម ឬសម្អាតការជ្រើសរើស។",
      clearIngredients: "សម្អាតគ្រឿងផ្សំ",
      loadingRecipes: "កំពុងផ្ទុកមុខម្ហូប...",
      loadingHint: "កំពុងផ្គូផ្គងមុខម្ហូបតាមគ្រឿងផ្សំរបស់អ្នក។",
      recipesYouCanMake: "អ្នកអាចធ្វើបាន {count} មុខម្ហូប",
      doYouHave: "អ្នកមានអ្វីខ្លះ?",
      noRecipesInCategory: "គ្មានមុខម្ហូបក្នុងប្រភេទ {category}",
      tryAnotherCategory: "សូមសាកល្បងប្រភេទផ្សេង។",
      categories: {
        all: "ទាំងអស់",
        khmerFood: "ម្ហូបខ្មែរ",
        asianFood: "ម្ហូបអាស៊ី",
        european: "អឺរ៉ុប",
      },
    },
    about: {
      badge: "អំពីពួកយើង",
      heroTitle: "កំពុងសាងសង់បទពិសោធន៍ចម្អិនអាហារឆ្លាតវៃជាមួយ MhobFinder",
      heroDescription:
        "MhobFinder គឺជាវេទិកាស្វែងរកមុខម្ហូប ដែលជួយអ្នកចម្អិនអាហារជាមួយគ្រឿងផ្សំដែលមានស្រាប់។ យើងផ្តោតលើការផ្គូផ្គងគ្រឿងផ្សំឲ្យមានប្រសិទ្ធភាព លំហូរប្រើប្រាស់ច្បាស់លាស់ និងបទពិសោធន៍រលូនសម្រាប់ការសម្រេចចិត្តប្រចាំថ្ងៃក្នុងផ្ទះបាយ។",
      tryApp: "សាកល្បងកម្មវិធី",
      viewFeatures: "មើលមុខងារ",
      featureTitle: "មុខងារសំខាន់ៗ",
      featureDescription: "ស្វែងយល់ពីសមត្ថភាពសំខាន់ៗរបស់ MhobFinder។",
      features: {
        smartMatching: "ការផ្គូផ្គងគ្រឿងផ្សំឆ្លាតវៃ",
        recipeDetails: "មើលព័ត៌មានលម្អិតមុខម្ហូបពេញលេញ",
        multiLanguage: "គាំទ្រច្រើនភាសា / ចូលដោយ Google",
      },
      teamTitle: "សមាជិកក្រុមរបស់យើង",
      teamDescription: "ស្គាល់សមាជិកដែលកំពុងអភិវឌ្ឍ និងកែលម្អ MhobFinder។",
      footer: {
        copyright: "រក្សាសិទ្ធិ {year} MhobFinder. រក្សាសិទ្ធិគ្រប់យ៉ាង។",
        about: "អំពី",
        home: "ទំព័រដើម",
      },
    },
  },

  // Chinese translations
ch: {
  common: {
    language: "语言",
    searchPlaceholder: "搜索...",
    translationsAria: "翻译",
    categoryLabel: "类别",
    all: "全部",
    loading: "加载中...",
    cancel: "取消",
    ok: "确定",
  },

  start: {
    register: "注册",
    badge: "100% 免费 — 无广告，无需注册",
    heroLine1: "用你已有的食材",
    heroLine2: "开始烹饪。",
    subtitle:
      "选择你厨房里的食材, MhobFinder 会立即显示你可以制作的食谱，无需购物。",
    getStarted: "开始",
    login: "登录",
    quickStats: {
      activeRecipes: "可用食谱",
      pantryIngredients: "食材数量",
      averageSetup: "平均准备时间",
    },
    previewTitle: "MhobFinder — 预览",
    yourIngredients: "你的食材",
    matchingRecipes: "匹配的食谱",
    bestMatch: "最佳匹配",
  },

  topBar: {
    favoritesPage: "收藏",
    profilePage: "个人资料",
    searchRecipesOrUsers: "搜索食谱或用户",
    adminBrand: "MhobFinder 管理",
    pantryTitle: "食材库",
    pantryCount: "你有 {count} 个食材",
    clearAllIngredients: "清除所有食材",
    removeAllIngredientsTitle: "删除所有食材？",
    removeAllIngredientsDesc: "你确定要删除所有已选择的食材吗？",
    inputIngredient: "添加食材...",
    ingredientAdded: "✓ 已添加",
    auth: {
      checking: "正在检查会话...",
      loggedInAs: "已登录: {name}",
      guest: "游客",
    },
    adminTitles: {
      manageUser: "用户管理",
      analytical: "数据分析",
      addFood: "添加食谱",
      editFood: "编辑食谱",
      foods: "食谱库",
      ingredients: "食材管理",
      default: "管理仪表板",
    },
  },

  home: {
    emptyTitle: "添加食材以开始",
    emptySubtitle: "添加的食材越多，可制作的食谱越多",
    noRecipesFound: "未找到食谱",
    noRecipesHint: "尝试添加更多食材，或清除选择。",
    clearIngredients: "清除食材",
    loadingRecipes: "正在加载食谱...",
    loadingHint: "正在匹配食材和食谱。",
    recipesYouCanMake: "你可以制作 {count} 个食谱",
    doYouHave: "你有什么食材？",
    noRecipesInCategory: "{category} 中没有食谱",
    tryAnotherCategory: "尝试其他类别。",
    categories: {
      all: "全部",
      khmerFood: "高棉菜",
      asianFood: "亚洲菜",
      european: "欧洲菜",
    },
  },

  about: {
    badge: "关于我们",
    heroTitle: "用 MhobFinder 打造智能烹饪体验",
    heroDescription:
      "MhobFinder 是一个食谱平台，帮助用户用现有食材进行烹饪。",
    tryApp: "试用应用",
    viewFeatures: "查看功能",
    featureTitle: "功能亮点",
    featureDescription: "探索 MhobFinder 的主要功能。",
    features: {
      smartMatching: "智能食材匹配",
      recipeDetails: "查看完整食谱",
      multiLanguage: "多语言 / Google 登录",
    },
    teamTitle: "团队成员",
    teamDescription: "认识打造 MhobFinder 的团队。",
    footer: {
      copyright: "版权所有 {year} MhobFinder",
      about: "关于",
      home: "首页",
    },
  },
},

  // Japanese translations
  jp: {
    common: {
      language: "言語",
      searchPlaceholder: "検索...",
      translationsAria: "翻訳",
      categoryLabel: "カテゴリー",
      all: "すべて",
      loading: "読み込み中...",
      cancel: "キャンセル",
      ok: "OK",
    },

    start: {
      register: "登録",
      badge: "100％無料 — 広告なし、サインアップ不要",
      heroLine1: "今あるもので",
      heroLine2: "料理しよう。",
      subtitle:
        "キッチンにある材料を選ぶだけで、MhobFinderがすぐに作れるレシピを提案します。買い物は不要です。",
      getStarted: "始める",
      login: "ログイン",
      quickStats: {
        activeRecipes: "公開中のレシピ",
        pantryIngredients: "食材数",
        averageSetup: "平均準備時間",
      },
      previewTitle: "MhobFinder — プレビュー",
      yourIngredients: "あなたの食材",
      matchingRecipes: "一致するレシピ",
      bestMatch: "最適なレシピ",
    },

    topBar: {
      favoritesPage: "お気に入り",
      profilePage: "プロフィール",
      searchRecipesOrUsers: "レシピやユーザーを検索",
      adminBrand: "MhobFinder 管理",
      pantryTitle: "パントリー",
      pantryCount: "あなたは{count}個の食材を持っています",
      clearAllIngredients: "すべての食材をクリア",
      removeAllIngredientsTitle: "すべての食材を削除しますか？",
      removeAllIngredientsDesc: "選択したすべての食材を削除してもよろしいですか？",
      inputIngredient: "食材を追加...",
      ingredientAdded: "✓ 追加済み",
      auth: {
        checking: "セッション確認中...",
        loggedInAs: "ログイン中: {name}",
        guest: "ゲスト",
      },
      adminTitles: {
        manageUser: "ユーザー管理",
        analytical: "分析",
        addFood: "レシピ追加",
        editFood: "レシピ編集",
        foods: "レシピ一覧",
        ingredients: "食材管理",
        default: "管理ダッシュボード",
      },
    },

    home: {
      emptyTitle: "食材を追加して始めましょう",
      emptySubtitle:
        "食材を追加するほど、作れるレシピが増えていきます",
      noRecipesFound: "レシピが見つかりません",
      noRecipesHint:
        "食材を追加するか、選択をリセットしてみてください。",
      clearIngredients: "食材をクリア",
      loadingRecipes: "レシピを読み込み中...",
      loadingHint: "食材に合うレシピを探しています。",
      recipesYouCanMake: "{count}件のレシピが作れます",
      doYouHave: "持っている食材は？",
      noRecipesInCategory: "{category}にはレシピがありません",
      tryAnotherCategory: "別のカテゴリーを試してください。",
      categories: {
        all: "すべて",
        khmerFood: "クメール料理",
        asianFood: "アジア料理",
        european: "ヨーロッパ料理",
      },
    },

    about: {
      badge: "私たちについて",
      heroTitle: "MhobFinderでスマートな料理体験を",
      heroDescription:
        "MhobFinderは、手元にある食材で作れるレシピを提案するプラットフォームです。実用的な食材マッチング、わかりやすい操作性、日常の料理をサポートする体験を提供します。",
      tryApp: "アプリを試す",
      viewFeatures: "機能を見る",
      featureTitle: "主な機能",
      featureDescription:
        "MhobFinderの主な機能をご紹介します。",
      features: {
        smartMatching: "スマート食材マッチング",
        recipeDetails: "レシピ詳細表示",
        multiLanguage: "多言語対応 / Googleログイン",
      },
      teamTitle: "チームメンバー",
      teamDescription:
        "MhobFinderを開発・改善しているメンバーです。",
      footer: {
        copyright:
          "Copyright {year} MhobFinder. All rights reserved.",
        about: "私たちについて",
        home: "ホーム",
      },
    },
  },
};
