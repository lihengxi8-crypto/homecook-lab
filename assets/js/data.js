/* =========================================================
   家常菜实验室 · 数据层（零依赖，挂到 window.HCL）
   - 术语表 glossary
   - 食材特性档案 ingredients
   - 案例菜库 dishes
   - 味型配比 tastes（计算器用）
   - 创新组合变量 combo（主料 / 预处理 / 技法 / 味型 + 约束规则）
   - 搜索条目 topics（篇章下的可检索小节）
   - 工具/参考页 utils（导航用）
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 工具 / 参考页（导航“工具箱”用） ---------- */
  const utils = [
    { id: 'dishes',      file: 'dishes.html',      title: '案例菜库', en: 'Recipes',     icon: '🍲' },
    { id: 'ingredients', file: 'ingredients.html', title: '食材档案', en: 'Ingredients', icon: '🥩' },
    { id: 'tools',       file: 'tools.html',       title: '厨房工具', en: 'Tools',       icon: '🧮' },
    { id: 'glossary',    file: 'glossary.html',    title: '术语表',   en: 'Glossary',    icon: '📖' },
  ];

  /* ---------- 术语表 ----------
     term：主词；aliases：正文里需要被自动识别的别名；
     chapter：详见的篇章文件；cat：分类 */
  const glossary = [
    { id: 'maillard', term: '美拉德反应', cat: '化学', aliases: ['美拉德', '美拉德反应'],
      def: '氨基酸（蛋白质）与还原糖在高温下（约 140–165℃）发生的褐变反应，生成上百种风味物质和金黄/棕色。煎、炸、烤、煸出的“香”大多来自它。', chapter: 'principles.html' },
    { id: 'caramel', term: '焦糖化', cat: '化学', aliases: ['焦糖化', '焦糖'],
      def: '糖在约 160℃ 以上单独受热分解、上色、产生焦香的反应。和美拉德不同，它不需要蛋白质。炒糖色、糖醋上色靠它。', chapter: 'principles.html' },
    { id: 'denature', term: '蛋白质变性', cat: '物理化学', aliases: ['蛋白质变性', '变性'],
      def: '蛋白质受热、遇酸或遇盐时空间结构展开、重新交联的过程。表现为肉变色变硬、蛋液凝固。控制变性程度＝控制嫩老。', chapter: 'principles.html' },
    { id: 'gelatinize', term: '淀粉糊化', cat: '物理化学', aliases: ['糊化', '淀粉糊化'],
      def: '淀粉颗粒在足够水和约 60–75℃ 加热下吸水膨胀、变黏变透明的过程。勾芡、煮粥、土豆变粉糯都靠它。', chapter: 'principles.html' },
    { id: 'retrograde', term: '淀粉回生', cat: '物理化学', aliases: ['回生', '老化', '返生'],
      def: '糊化后的淀粉在冷藏（尤其 0–4℃）后重新排列、变硬变干的现象。米饭馒头隔夜变硬就是它，复热可部分逆转。', chapter: 'practice.html' },
    { id: 'emulsion', term: '乳化', cat: '物理化学', aliases: ['乳化'],
      def: '把油和水在乳化剂帮助下打成稳定的细小液滴混合体。奶白的鱼汤、顺滑的酱汁、芝麻酱澥开都和它有关。', chapter: 'principles.html' },
    { id: 'umami', term: '鲜味协同', cat: '风味', aliases: ['鲜味协同', '鲜味', '谷氨酸', '肌苷酸', '鸟苷酸', '呈味核苷酸'],
      def: '谷氨酸（味精/海带/酱油）与肌苷酸（肉/鱼）、鸟苷酸（菌菇）同时存在时，鲜味会成倍放大。这就是“高汤＝肉＋海带＋菌”的科学原因。', chapter: 'principles.html' },
    { id: 'salt-protein', term: '盐溶蛋白', cat: '物理化学', aliases: ['盐溶蛋白'],
      def: '肉中的肌球蛋白在盐的作用下溶出、形成黏性网络，能把水分“抓住”。抓肉上劲、肉丸弹牙、上浆锁水都靠它。', chapter: 'prep.html' },
    { id: 'sizing', term: '上浆', cat: '技法', aliases: ['上浆'],
      def: '给肉裹一层蛋清＋淀粉的薄浆，下锅后浆层先糊化成“防热外衣”，让里面的肉在低温油里慢慢变性，从而滑嫩不柴。', chapter: 'prep.html' },
    { id: 'coding', term: '码味', cat: '技法', aliases: ['码味', '腌制'],
      def: '下锅前用盐、生抽、料酒等给食材“打底味”并去腥。盐还能启动盐溶蛋白、帮助保水。', chapter: 'prep.html' },
    { id: 'blanch', term: '焯水', cat: '技法', aliases: ['焯水', '汆烫', '飞水'],
      def: '把食材在沸水或冷水里短暂加热：去腥去血沫、断生、护色或预熟。冷水下锅适合去腥（肉），沸水快焯适合护色（绿叶菜）。', chapter: 'prep.html' },
    { id: 'thicken', term: '勾芡', cat: '技法', aliases: ['勾芡', '芡汁', '水淀粉'],
      def: '用水淀粉在收尾时糊化增稠，让汤汁裹住食材、亮泽挂味。芡要在汤滚时下、推匀至透明，过早会澥、过厚会糊。', chapter: 'sauces.html' },
    { id: 'wok-hei', term: '锅气', cat: '风味', aliases: ['锅气'],
      def: '猛火快炒时，食材表面瞬间高温脱水＋美拉德＋微焦，加上油脂受热的香气，形成的那股“镬气”。靠的是高温、少量、快速、别拥锅。', chapter: 'techniques.html' },
    { id: 'heat-transfer', term: '热传递', cat: '物理', aliases: ['热传递', '传导', '对流', '辐射'],
      def: '热量进入食材的三种方式：传导（锅→食材直接接触）、对流（油/水/蒸汽带热）、辐射（烤箱/炭火）。不同技法本质是不同的热传递组合。', chapter: 'principles.html' },
    { id: 'danger-zone', term: '危险温度区间', cat: '安全', aliases: ['危险温度区间', '危险温度带', '危险区'],
      def: '约 4–60℃ 是细菌快速繁殖的温度带。熟食别在此区间久放，热菜尽快冷却进冰箱、冷菜及时回锅热透。', chapter: 'practice.html' },
    { id: 'tenderize', term: '致嫩', cat: '技法', aliases: ['致嫩', '小苏打', '嫩肉粉'],
      def: '通过小苏打（弱碱，提高 pH 让蛋白持水、松弛纤维）、木瓜/菠萝蛋白酶或机械（拍打、逆纹切）让肉更嫩。小苏打要少量，多了发涩有碱味。', chapter: 'prep.html' },
    { id: 'osmosis', term: '渗透压', cat: '物理', aliases: ['渗透压', '渗透', '杀水', '出水'],
      def: '盐糖浓度差驱动水分穿过细胞膜流动。盐撒在蔬菜上“杀水”、腌肉脱水入味、糖渍都靠它。所以炒青菜的盐别放太早。', chapter: 'prep.html' },
    { id: 'refry', term: '复炸', cat: '技法', aliases: ['复炸', '回锅炸'],
      def: '先低温炸熟、捞出，再高温复炸几十秒。第二次高温逼出水分、催动美拉德，外壳更酥脆且不易回软。', chapter: 'techniques.html' },
    { id: 'carryover', term: '余温加热', cat: '物理', aliases: ['余温', '余温加热', '回温'],
      def: '离火后食材表面的热量继续向中心传导，中心温度还会上升几度。所以肉、蛋常在“差一点熟”时就出锅。', chapter: 'techniques.html' },
    { id: 'collagen', term: '胶原蛋白', cat: '物理化学', aliases: ['胶原蛋白', '胶原', '结缔组织', '明胶'],
      def: '牛腩、蹄筋、五花等结缔组织中的蛋白，需长时间低温慢炖（约 70–90℃ 久煮）才会水解成明胶，带来软糯黏唇的口感。急火快炒只会更硬。', chapter: 'techniques.html' },
    { id: 'oil-temp', term: '油温成数', cat: '技法', aliases: ['油温', '几成热', '成热'],
      def: '老厨用“成数”估油温：约每成 30℃。三四成（90–120℃）温油滑、五六成（150–180℃）炸炒、七八成（210–240℃）爆香快炸。', chapter: 'techniques.html' },
    { id: 'bowl-sauce', term: '兑碗汁', cat: '技法', aliases: ['兑碗汁', '碗汁', '料汁'],
      def: '下锅前把调料按比例在小碗里调好（含水淀粉）。猛火快炒时一次淋入，避免手忙脚乱、受热不均——味型由此变成可计算的配比。', chapter: 'sauces.html' },
  ];

  /* ---------- 食材特性档案 ----------
     type：肉类 / 海鲜 / 蔬菜 / 蛋豆 / 根茎淀粉 / 菌菇
     props：关键属性标签；best：适合技法；note：一句话要点 */
  const ingredients = [
    { id: 'pork-loin', name: '猪里脊', emoji: '🐖', type: '肉类',
      props: ['瘦', '少胶原', '易柴'], best: ['滑炒', '爆炒', '上浆'],
      note: '纤维细、脂肪少，过火立刻发柴。逆纹切薄＋上浆，温油滑散变色即起。', terms: ['sizing', 'denature'] },
    { id: 'pork-belly', name: '五花肉', emoji: '🥓', type: '肉类',
      props: ['肥瘦相间', '富胶原', '耐炖'], best: ['红烧', '炖焖', '煸炒'],
      note: '肥瘦层次＋结缔组织，越炖越糯。先煸出油更香不腻。', terms: ['collagen', 'maillard'] },
    { id: 'beef-tender', name: '牛里脊 / 牛柳', emoji: '🐄', type: '肉类',
      props: ['嫩', '怕过火'], best: ['滑炒', '爆炒', '煎'],
      note: '逆纹切、可加少量小苏打致嫩，大火快炒锁汁，七分熟即可。', terms: ['tenderize', 'denature'] },
    { id: 'beef-brisket', name: '牛腩', emoji: '🐮', type: '肉类',
      props: ['高胶原', '结缔组织多'], best: ['炖', '红烧'],
      note: '必须低温久炖（约 70–90℃）让胶原化明胶才软糯，急火快炒只会硬。', terms: ['collagen'] },
    { id: 'chicken-breast', name: '鸡胸', emoji: '🐔', type: '肉类',
      props: ['极瘦', '极易柴'], best: ['上浆滑炒', '低温煎'],
      note: '含水低、纤维直，最考验控火。上浆＋控温，断生即止是关键。', terms: ['sizing', 'carryover'] },
    { id: 'chicken-thigh', name: '鸡腿肉', emoji: '🍗', type: '肉类',
      props: ['多汁', '耐煮', '带脂'], best: ['炖', '煎', '红烧', '炸'],
      note: '比鸡胸宽容得多，久煮也嫩，适合新手做主料。', terms: [] },
    { id: 'shrimp', name: '虾仁', emoji: '🦐', type: '海鲜',
      props: ['快熟', '过火变硬'], best: ['爆炒', '上浆滑炒'],
      note: '上浆保水、大火十几秒卷起变红即起，久炒就老。', terms: ['sizing', 'denature'] },
    { id: 'fish', name: '鱼（鲈鱼/草鱼）', emoji: '🐟', type: '海鲜',
      props: ['细嫩', '易碎', '腥'], best: ['清蒸', '煎', '红烧'],
      note: '肉嫩易散：清蒸看准时间、煎前擦干定型、红烧少翻动。', terms: ['denature', 'blanch'] },
    { id: 'egg', name: '鸡蛋', emoji: '🥚', type: '蛋豆',
      props: ['蛋白约60℃凝固', '嫩滑靠控温'], best: ['炒', '煎', '蒸羹'],
      note: '凝固早、余温足，要在“将凝未凝”时出锅。蒸蛋加温水、滤泡更滑。', terms: ['denature', 'carryover'] },
    { id: 'tofu', name: '豆腐', emoji: '🧈', type: '蛋豆',
      props: ['嫩豆腐怕翻动', '老豆腐耐煎'], best: ['烧', '羹', '煎'],
      note: '嫩豆腐先盐水/焯一下更不易碎；老豆腐煎到金黄再烧更香。', terms: ['denature'] },
    { id: 'potato', name: '土豆', emoji: '🥔', type: '根茎淀粉',
      props: ['高淀粉'], best: ['炒丝', '炖', '炸'],
      note: '炒丝要先泡/冲去表面淀粉才脆爽；要粉糯就久炖让淀粉糊化。', terms: ['gelatinize'] },
    { id: 'leafy', name: '绿叶菜（菠菜/油菜）', emoji: '🥬', type: '蔬菜',
      props: ['怕久煮发黄', '出水'], best: ['大火快炒', '快焯'],
      note: '高温短时、盐晚放护色保脆；草酸高的先快焯。', terms: ['blanch', 'osmosis'] },
    { id: 'broccoli', name: '西兰花 / 花菜', emoji: '🥦', type: '蔬菜',
      props: ['需断生', '护色'], best: ['焯水', '快炒'],
      note: '沸水加盐与几滴油快焯 30–60 秒、过冰水定色，再下锅。', terms: ['blanch'] },
    { id: 'eggplant', name: '茄子', emoji: '🍆', type: '蔬菜',
      props: ['吸油', '易氧化变黑'], best: ['过油', '蒸', '盐杀水'],
      note: '切后泡盐水防氧化；过油或先蒸能减少吸油、保色。', terms: ['osmosis'] },
    { id: 'mushroom', name: '香菇 / 菌菇', emoji: '🍄', type: '菌菇',
      props: ['鲜味（鸟苷酸）'], best: ['提鲜', '炖', '炒'],
      note: '天然鲜味来源，和肉同烧鲜味协同放大；干香菇泡发风味更浓。', terms: ['umami'] },
    { id: 'onion', name: '洋葱', emoji: '🧅', type: '蔬菜',
      props: ['含硫', '焦糖化出甜'], best: ['炒香打底', '炖'],
      note: '中小火慢炒会焦糖化变甜，是很多菜的甜味底；爆香增层次。', terms: ['caramel'] },
  ];

  /* ---------- 案例菜库 ----------
     每道菜标注用到的【原理 / 预处理 / 技法 / 味型】，并链接到对应篇章 */
  const dishes = [
    { id: 'tomato-egg', name: '番茄炒蛋', emoji: '🍅', level: '易',
      summary: '最适合练“鸡蛋控温＋糖平衡酸”的入门菜。',
      principles: [['蛋白质变性', 'principles.html'], ['余温加热', 'techniques.html']],
      prep: [['打散加少许盐', 'prep.html']], tech: [['滑炒', 'techniques.html']],
      taste: [['咸鲜带甜', 'sauces.html']],
      steps: ['蛋液加盐打散；番茄切块（可去皮）。', '热锅热油，蛋液大火快炒至蓬松将凝即起。', '余油炒番茄出沙，加少许糖平衡酸味、盐调味。', '回蛋翻匀，几秒出锅，撒葱花。'] },
    { id: 'slip-pork', name: '滑炒里脊', emoji: '🥩', level: '中',
      summary: '上浆致嫩的范本：温油滑散、断生即止。',
      principles: [['盐溶蛋白', 'prep.html'], ['蛋白质变性', 'principles.html']],
      prep: [['逆纹切片', 'prep.html'], ['码味', 'prep.html'], ['上浆', 'prep.html']], tech: [['滑炒', 'techniques.html']],
      taste: [['咸鲜碗汁', 'sauces.html']],
      steps: ['里脊逆纹切薄片，盐+生抽+料酒码味。', '分次抓葱姜水上劲，加蛋清、淀粉上浆封油。', '三四成温油下锅滑散，变色即捞。', '爆香配料、下肉、淋碗汁，几秒翻匀出锅。'] },
    { id: 'fish-pork', name: '鱼香肉丝', emoji: '🌶️', level: '中',
      summary: '没有鱼的“鱼香”——靠泡椒＋糖醋＋葱姜蒜调出的复合味型。',
      principles: [['鲜味协同', 'principles.html']],
      prep: [['切丝上浆', 'prep.html']], tech: [['滑炒', 'techniques.html'], ['勾芡', 'sauces.html']],
      taste: [['鱼香（酸甜辣咸鲜）', 'sauces.html']],
      steps: ['肉丝码味上浆；兑鱼香碗汁（糖醋生抽料酒+水淀粉）。', '滑油划散盛出。', '泡椒/豆瓣炒红油，下葱姜蒜末。', '回肉丝、配丝，淋碗汁推匀勾芡出锅。'] },
    { id: 'sweet-sour', name: '糖醋里脊', emoji: '🍖', level: '中',
      summary: '复炸出酥壳＋经典“1-2-3-4-5”糖醋汁。',
      principles: [['美拉德反应', 'principles.html'], ['焦糖化', 'principles.html']],
      prep: [['切条腌制', 'prep.html'], ['挂糊', 'prep.html']], tech: [['复炸', 'techniques.html']],
      taste: [['糖醋', 'sauces.html']],
      steps: ['里脊切条腌味、挂糊。', '五成油炸熟捞出，升高油温复炸至金黄酥脆。', '另起锅下糖醋汁熬到稠亮。', '倒入炸好的里脊快速裹匀，撒白芝麻。'] },
    { id: 'kungpao', name: '宫保鸡丁', emoji: '🥜', level: '中',
      summary: '糊辣荔枝味＋花生脆，碗汁与火候的协奏。',
      principles: [['美拉德反应', 'principles.html'], ['余温加热', 'techniques.html']],
      prep: [['鸡丁上浆', 'prep.html']], tech: [['爆炒', 'techniques.html'], ['勾芡', 'sauces.html']],
      taste: [['糊辣/小荔枝（酸甜）', 'sauces.html']],
      steps: ['鸡丁码味上浆；兑宫保碗汁。', '热油滑鸡丁至变色盛出。', '小火炒干辣椒花椒出糊辣香，下葱姜蒜。', '回鸡丁淋碗汁勾薄芡，放炸花生翻匀出锅。'] },
    { id: 'braised-pork', name: '红烧肉', emoji: '🍯', level: '中',
      summary: '炒糖色＋小火慢炖，把胶原炖成软糯。',
      principles: [['胶原蛋白', 'techniques.html'], ['焦糖化', 'principles.html']],
      prep: [['切块焯水', 'prep.html']], tech: [['炒糖色', 'techniques.html'], ['炖焖', 'techniques.html']],
      taste: [['红烧酱香', 'sauces.html']],
      steps: ['五花切块冷水下锅焯去血沫。', '小火炒糖色，下肉块上色。', '加料酒、生抽、少许老抽、葱姜八角，加热水没过。', '小火慢炖 40–60 分钟，大火收汁亮油。'] },
    { id: 'mapo-tofu', name: '麻婆豆腐', emoji: '🌶️', level: '中',
      summary: '麻辣鲜香烫，分次勾芡让芡汁裹住嫩豆腐。',
      principles: [['淀粉糊化', 'principles.html'], ['鲜味协同', 'principles.html']],
      prep: [['豆腐盐水焯', 'prep.html']], tech: [['烧', 'techniques.html'], ['勾芡', 'sauces.html']],
      taste: [['麻辣', 'sauces.html']],
      steps: ['嫩豆腐切块、淡盐水浸/焯一下防碎。', '豆瓣＋豆豉炒红油，下肉末炒香。', '加汤下豆腐轻推煮入味。', '分 2–3 次勾芡至浓亮，撒花椒面、蒜苗出锅。'] },
    { id: 'steamed-fish', name: '清蒸鲈鱼', emoji: '🐟', level: '中',
      summary: '极简却最考火候：看准时间、热油激香。',
      principles: [['蛋白质变性', 'principles.html'], ['余温加热', 'techniques.html']],
      prep: [['改刀控水', 'prep.html']], tech: [['清蒸', 'techniques.html']],
      taste: [['清鲜（豉油）', 'sauces.html']],
      steps: ['鱼擦干、两面改刀，垫葱姜。', '水大开上锅，一斤左右蒸 7–9 分钟。', '倒掉腥水、铺葱丝，淋蒸鱼豉油。', '泼热油激香即成。'] },
    { id: 'potato-shred', name: '醋熘土豆丝', emoji: '🥔', level: '易',
      summary: '脆爽关键＝冲淀粉＋大火快炒＋后放醋。',
      principles: [['淀粉糊化', 'principles.html'], ['渗透压', 'prep.html']],
      prep: [['切丝泡水冲淀粉', 'prep.html']], tech: [['爆炒', 'techniques.html']],
      taste: [['酸辣咸鲜', 'sauces.html']],
      steps: ['土豆切细丝，反复冲泡去表面淀粉，沥干。', '热锅热油、干辣椒花椒炝锅。', '大火快炒土豆丝，断生保脆。', '沿锅边烹醋、加盐，快速翻匀出锅。'] },
    { id: 'gongbao-veg', name: '蒜蓉西兰花', emoji: '🥦', level: '易',
      summary: '焯水护色＋蒜香快炒的清爽配菜。',
      principles: [['焯水护色', 'prep.html']],
      prep: [['切朵焯水过冰', 'prep.html']], tech: [['快炒', 'techniques.html']],
      taste: [['蒜香咸鲜', 'sauces.html']],
      steps: ['切小朵，沸水加盐油快焯 30–60 秒，过冰水。', '蒜末爆香。', '下西兰花大火快炒，盐调味。', '可勾薄芡增亮，出锅。'] },
    { id: 'twice-pork', name: '回锅肉', emoji: '🐷', level: '中',
      summary: '先煮后炒，煸出“灯盏窝”＋豆瓣酱香。',
      principles: [['美拉德反应', 'principles.html'], ['焦糖化', 'principles.html']],
      prep: [['先煮断生切片', 'prep.html']], tech: [['煸炒', 'techniques.html']],
      taste: [['咸鲜微辣（豆瓣）', 'sauces.html']],
      steps: ['五花整块煮至断生，晾凉切薄片。', '少油中火煸肉片出油、卷边。', '下豆瓣＋豆豉炒红油，加蒜苗/青椒。', '调味翻匀，断生即出。'] },
    { id: 'tomato-beef-stew', name: '番茄炖牛腩', emoji: '🍲', level: '难',
      summary: '高胶原部位＋长时间慢炖的软糯代表。',
      principles: [['胶原蛋白', 'techniques.html'], ['鲜味协同', 'principles.html']],
      prep: [['切块焯水', 'prep.html']], tech: [['炖焖', 'techniques.html']],
      taste: [['番茄酸甜咸鲜', 'sauces.html']],
      steps: ['牛腩切块冷水焯去血沫。', '炒番茄出沙，下牛腩翻炒。', '加热水没过，小火慢炖 1.5–2 小时至软糯。', '收汁调味，撒葱花。'] },
  ];

  /* ---------- 味型配比（计算器）----------
     parts 以“勺”为份额；base 默认基准勺数；note 提示 */
  const tastes = [
    { id: 'tangcu', name: '糖醋汁（1-2-3-4-5）', desc: '经典万能糖醋，记忆口诀“1料酒2酱油3糖4醋5水”。',
      items: [['料酒', 1], ['生抽', 2], ['白糖', 3], ['香醋', 4], ['清水', 5]],
      note: '糖醋里脊/排骨通用。要更亮可加少许番茄酱；收汁时下水淀粉。' },
    { id: 'yuxiang', name: '鱼香汁', desc: '酸甜辣咸鲜复合，靠泡椒/豆瓣＋葱姜蒜出“鱼香”。',
      items: [['白糖', 3], ['香醋', 3], ['生抽', 2], ['料酒', 1], ['清水', 4], ['水淀粉', 1]],
      note: '另需泡椒/郫县豆瓣＋葱姜蒜末。先炒红油再淋碗汁勾芡。' },
    { id: 'xianxian', name: '咸鲜碗汁（滑炒通用）', desc: '滑炒肉/海鲜的百搭碗汁，鲜而不抢味。',
      items: [['生抽', 2], ['蚝油', 1], ['白糖', 0.5], ['清水', 4], ['水淀粉', 1]],
      note: '盐按口味补；适合滑炒里脊、虾仁、鸡丁。' },
    { id: 'gongbao', name: '宫保汁（小荔枝味）', desc: '糖醋打底、微酸甜带糊辣，回口咸鲜。',
      items: [['白糖', 2], ['香醋', 2], ['生抽', 1.5], ['料酒', 1], ['清水', 3], ['水淀粉', 1]],
      note: '配干辣椒花椒炒香；芡要薄、亮汁包裹。' },
    { id: 'hongshao', name: '红烧汁', desc: '酱香微甜、上色靠老抽与糖色。',
      items: [['生抽', 2], ['老抽', 0.5], ['白糖', 2], ['料酒', 2], ['清水', 12]],
      note: '清水按“没过食材”估；炖煮收汁，慎放盐（酱油已咸）。' },
    { id: 'suanla', name: '酸辣汁', desc: '酸为主、辣提味，开胃爽口。',
      items: [['香醋', 3], ['生抽', 2], ['白糖', 1], ['清水', 3], ['辣椒油', 1]],
      note: '凉拌可加蒜末香油；热菜沿锅边烹醋更香。' },
    { id: 'suanrong', name: '蒜香凉拌汁', desc: '蒜香咸鲜微甜，拌菜/白灼通用。',
      items: [['生抽', 2], ['香醋', 1], ['白糖', 0.5], ['香油', 1]],
      note: '另加蒜末、辣椒、少许蒸鱼豉油提鲜。' },
  ];

  /* ---------- 创新组合变量 + 约束规则 ----------
     type：tender(嫩瘦/海鲜/蛋) / collagen(高胶原) / durable(耐煮) /
           veg(蔬菜) / starch(淀粉) / tofu(豆制品) */
  const combo = {
    mains: [
      { label: '猪里脊', type: 'tender' }, { label: '牛柳', type: 'tender' },
      { label: '鸡胸', type: 'tender' }, { label: '虾仁', type: 'tender' },
      { label: '鸡蛋', type: 'tender' }, { label: '鱼片', type: 'tender' },
      { label: '牛腩', type: 'collagen' }, { label: '五花肉', type: 'collagen' },
      { label: '鸡腿肉', type: 'durable' }, { label: '排骨', type: 'collagen' },
      { label: '豆腐', type: 'tofu' }, { label: '土豆', type: 'starch' },
      { label: '西兰花', type: 'veg' }, { label: '茄子', type: 'veg' }, { label: '青椒', type: 'veg' },
    ],
    preps: ['上浆', '码味腌制', '焯水', '过油', '切丝', '切片', '切块', '拍粉挂糊'],
    techs: [
      { label: '滑炒', good: ['tender'], note: '温油滑散、断生即止，最锁嫩。' },
      { label: '爆炒', good: ['tender', 'veg'], note: '猛火快炒出锅气，料别太多。' },
      { label: '干煸', good: ['veg', 'durable'], note: '中火煸出水分、表面起皱更香。' },
      { label: '清蒸', good: ['tender', 'tofu'], note: '看准时间，留住本味与嫩度。' },
      { label: '煎', good: ['tender', 'tofu', 'durable'], note: '擦干定型、别频繁翻动。' },
      { label: '炸', good: ['tender', 'starch', 'durable'], note: '控油温＋复炸更酥脆。' },
      { label: '红烧', good: ['collagen', 'durable', 'tofu'], note: '上色＋小火入味收汁。' },
      { label: '炖焖', good: ['collagen', 'durable'], note: '低温久煮把胶原炖成软糯。' },
      { label: '凉拌', good: ['veg', 'tofu'], note: '焯熟过凉，靠料汁出味。' },
    ],
    tastes: ['咸鲜', '糖醋', '鱼香', '麻辣', '香辣', '酸辣', '蒜香', '红烧酱香', '清淡本味'],
    typeName: { tender: '嫩/瘦/海鲜', collagen: '高胶原', durable: '耐煮', veg: '蔬菜', starch: '淀粉', tofu: '豆制品' },
  };

  /* ---------- 搜索条目：篇章下可检索的小节 ---------- */
  const topics = [
    // 第一篇
    { title: '热传递：传导/对流/辐射', page: 'principles.html', kw: '热 传导 对流 辐射 锅 油 蒸汽' },
    { title: '美拉德反应与上色生香', page: 'principles.html', kw: '美拉德 褐变 上色 香 煎炸烤' },
    { title: '蛋白质变性：嫩与老', page: 'principles.html', kw: '蛋白质 变性 嫩 老 凝固 收缩' },
    { title: '淀粉糊化与勾芡原理', page: 'principles.html', kw: '淀粉 糊化 勾芡 增稠' },
    { title: '乳化：奶白汤与顺滑酱', page: 'principles.html', kw: '乳化 油水 奶白汤 酱汁' },
    { title: '鲜味协同：1+1>2', page: 'principles.html', kw: '鲜味 谷氨酸 肌苷酸 味精 高汤' },
    // 第二篇
    { title: '刀工：尺寸与逆纹切', page: 'prep.html', kw: '刀工 逆纹 顺纹 切 尺寸 受热' },
    { title: '腌制码味与盐溶蛋白', page: 'prep.html', kw: '腌制 码味 盐溶蛋白 抓水 上劲' },
    { title: '上浆与小苏打致嫩', page: 'prep.html', kw: '上浆 蛋清 淀粉 小苏打 致嫩 滑嫩' },
    { title: '焯水：冷水/沸水与护色', page: 'prep.html', kw: '焯水 飞水 去腥 护色 断生 过冰水' },
    { title: '控水沥干与解冻', page: 'prep.html', kw: '控水 沥干 解冻 出水' },
    // 第三篇
    { title: '五味平衡', page: 'sauces.html', kw: '咸 甜 酸 辣 鲜 平衡 五味' },
    { title: '复合酱料职责与时机', page: 'sauces.html', kw: '生抽 老抽 蚝油 豆瓣 黄豆酱 酱料 时机' },
    { title: '味型公式与配比', page: 'sauces.html', kw: '味型 公式 配比 糖醋 鱼香 比例' },
    { title: '兑碗汁', page: 'sauces.html', kw: '碗汁 料汁 兑汁 快炒' },
    { title: '勾芡时机与技巧', page: 'sauces.html', kw: '勾芡 水淀粉 芡 时机 收汁' },
    // 第四篇
    { title: '技法分类：干热 vs 湿热', page: 'techniques.html', kw: '干热 湿热 分类 热源 介质' },
    { title: '油温成数判断', page: 'techniques.html', kw: '油温 成数 几成热 温油 热油' },
    { title: '炒：滑炒/爆炒/煸炒', page: 'techniques.html', kw: '炒 滑炒 爆炒 煸炒 锅气' },
    { title: '煎与炸（复炸）', page: 'techniques.html', kw: '煎 炸 复炸 酥脆' },
    { title: '蒸/炖/焖/烧/卤', page: 'techniques.html', kw: '蒸 炖 焖 烧 卤 红烧 慢炖' },
    { title: '锅气的科学', page: 'techniques.html', kw: '锅气 镬气 猛火 高温 快炒' },
    // 第五篇
    { title: '通用做菜流程模板', page: 'practice.html', kw: '流程 模板 步骤 准备 收尾' },
    { title: '翻车排查清单', page: 'practice.html', kw: '翻车 排查 失败 太咸 发柴 出水 糊锅' },
    { title: '剩菜保存与食品安全', page: 'practice.html', kw: '保存 剩菜 冷藏 冷冻 复热 危险温度 食品安全' },
    { title: '基于原理的创新方法', page: 'practice.html', kw: '创新 变量 组合 替换' },
  ];

  /* ---------- 参考视频：按篇章给出精选检索主题 ----------
     说明：静态站不内嵌第三方播放器（避免失效/隐私），改为「精选检索词」直达
     B 站 / YouTube 的搜索结果，长期有效。看完原理再看演示，事半功倍。 */
  const videos = {
    principles: [
      { t: '美拉德反应 烹饪 原理', note: '直观看糖与氨基酸如何褐变、生香、上色' },
      { t: '热传递 传导 对流 辐射 做饭', note: '理解三种传热方式对应哪些做法' },
      { t: '鲜味 谷氨酸 鸡精 味精 科学', note: '鲜味协同：为什么番茄配鸡蛋格外鲜' },
    ],
    prep: [
      { t: '牛肉 逆纹切 嫩 原理', note: '逆纹切断肌纤维，肉更嫩' },
      { t: '滑肉片 上浆 嫩滑 教程', note: '蛋清+淀粉+小苏打的致嫩上浆手法' },
      { t: '焯水 冷水下锅 热水下锅 区别', note: '什么时候冷水、什么时候沸水' },
    ],
    sauces: [
      { t: '兑碗汁 万能料汁 比例', note: '把味型变成可复制的配比' },
      { t: '鱼香 糖醋 味型 配方 原理', note: '经典复合味型的酸甜咸配比' },
      { t: '勾芡 水淀粉 比例 技巧', note: '薄芡/厚芡与下芡时机' },
    ],
    techniques: [
      { t: '油温 几成热 判断 方法', note: '用筷子/食材判断成数' },
      { t: '滑炒 爆炒 锅气 家庭 火力', note: '家用灶如何逼出锅气' },
      { t: '红烧肉 炒糖色 火候', note: '焦糖化与上色的火候控制' },
      { t: '炸 复炸 酥脆 原理', note: '为什么复炸更酥脆' },
    ],
    practice: [
      { t: '剩菜 保存 食品安全 危险温度', note: '4–60℃ 危险区与安全复热' },
      { t: '做菜 翻车 太咸 补救', note: '常见翻车的补救思路' },
      { t: '预制 备菜 meal prep 计划', note: '把流程模板用到一周备菜' },
    ],
  };

  window.HCL = { utils, glossary, ingredients, dishes, tastes, combo, topics, videos };
})();
