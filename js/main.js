;(async () => {
    const byId = (id) => document.getElementById(id);
    const qs = (selector, root = document) => root.querySelector(selector);

    function setText(element, value) {
        if (element) {
            element.textContent = value;
        }
    }

    function setHTML(element, value) {
        if (element) {
            element.innerHTML = value;
        }
    }

    function bindIfPresent(element, eventName, handler, options) {
        if (!element) {
            return false;
        }
        element.addEventListener(eventName, handler, options);
        return true;
    }

    function runInitStep(name, setup) {
        try {
            const result = setup();
            if (result && typeof result.then === 'function') {
                return result.catch((error) => {
                    console.error(`Failed to initialize ${name}:`, error);
                    return null;
                });
            }
            return result;
        } catch (error) {
            console.error(`Failed to initialize ${name}:`, error);
            return null;
        }
    }

    const languages = {
        zh: {
            mainTitle: "Lenni的人生地图",
            subtitleCn: "探索我的世界足迹",
            subtitleEn: "Explore My World Footprints",
            hintText: "点击地球上的标记开始探索",
            orderHint: "建议按时间顺序游览",
            germanyTitle: "Lenni的森林故乡",
            germanyDesc: "在德国的学术生活",
            germanyPoem: "在莱茵河畔的古堡中，\n我追寻着知识的足迹，\n每一页书卷都承载着梦想，\n每一堂课都点亮着未来。",
            germanyCard1: "<strong>秋千上的愿望</strong>你坐在小小的秋千上，抬手指向天空，<br>像是在认真告诉整个世界：<br>总有一天，我会去看遍每一个远方。",
            germanyCard2: "<strong>家是爱你的人</strong>被最爱你的人围绕着，<br>这份温暖也一路陪你长大。<br>家不只是一个地方，<br>更是那些始终在你身边的人。",
            germanyCard3: "<strong>柔软的小角落</strong>柔和的光落进每一个角落，<br>安放着最细小也最甜的回忆。<br>这里总让你的心<br>安静又踏实。",
            germanyCard4: "<strong>故事开始的地方</strong>安静的街道，细细的雨，<br>这里是你故事开始的地方。<br>也是从这里，<br>你一步步走向辽阔世界。",
            germanyCard5: "<strong>雾色清晨</strong>窗外的树影笼在薄雾里，<br>轻轻柔柔，像一场梦。<br>那时的你也早已知道，<br>前方还有很多美好的事在等你。",
            switzerlandTitle: "瑞士 · 阿尔卑斯山",
            switzerlandDesc: "瑞士的自然风光",
            switzerlandPoem: "瑞士实习：你的AI冒险 ✨\n你用家乡的薄雾换来瑞士的阳光，\n把对代码的热爱揣进口袋。\n在公司，你将AI编织进合同审查——\n把乏味的工作变成锐利、新颖的东西。\n\n同事们对你的聪明想法微笑，\n在你的代码行中发现未来。\n多年后，那个小小的实习火花\n绽放成稳定的伙伴关系。\n\n从那个好奇的实习生穿着霓虹衬衫，\n到成为可靠的伙伴带来影响——\n瑞士不仅给了你那城堡般的景色。\n它给了你科技故事的第一章。",
            franceTitle: "法国 · 浪漫之都",
            franceDesc: "巴黎的艺术与文化",
            francePoem: "你的法国时光 ✨\n你独自在阳光普照的法国街道漫步，\n运河金光闪闪，山脉低语柔和。\n你爱上了烘焙饼干，\n揉面直到拇指酸痛，\n拍下巧克力屑的无尽自拍——\n每一个都是欢乐的小庆祝。\n\n你不仅仅是观光客。\n你坐在法国教室里，\n学习你所热爱的那个地方的语言，\n一个词，一个句子，一个“Bonjour”一次。\n\n法国给了你不仅仅是美丽的景色和温暖的饼干。\n它给了你新的声音，\n新的爱好，\n以及一颗在世界上感觉更自在的心。",
            spainTitle: "西班牙 · 热情国度",
            spainDesc: "西班牙的文化遗产",
            spainPoem: "你的西班牙时光 ✨\n你漫步巴塞罗那的璀璨夜晚，\n高迪梦幻般的建筑照亮黑暗。\n白天，你学习西班牙语，和新朋友欢笑，\n让城市的金色光芒渗入你的骨髓。\n你爱上了每一个角落，\n甚至发誓有一天会回来定居。",
            chessAchievement: "你的国际象棋谜题书 🎯\n早在旅程的某个时刻或之前，\n你十几岁的求知欲绽放出非凡的东西。\n从构建AI到制作超过2000万国际象棋谜题，\n到看到它们作为五星级书出版——\n你把安静的深夜\n变成连大师都钦佩的东西。",
            chinaTitle: "中国 · 学业之旅",
            chinaDesc: "中国的传统文化",
            chinaPoem: "长城见证了历史的长河，\n故宫藏着帝王的秘密，\n长江黄河孕育了华夏文明，\n这里是我的根，我的魂。",
            chinaStage1: "<strong>华东理工大学</strong><span class=\"uni-name\">华东理工大学</span><br>你步入了上海的喧嚣，<br>友情迅速绽放，爱情也悄悄靠近。<br>你的中国篇章从这里开始，<br>明亮而温暖，充满新奇。",
            chinaStage2: "<strong>复旦大学</strong><span class=\"uni-name\">复旦大学</span><br>你用AI继续构建棋局，<br>数百万次落子变成三本新书。<br>在清华的夏校中你学习LLM，<br>心中种下了静静生长的梦想。",
            chinaStage3: "<strong>南京大学</strong><span class=\"uni-name\">南京大学</span><br>你与爱人在小窝中慢慢定居，<br>一起探索江河山川。<br>每个风景在她身边更明亮，<br>每段记忆都如阳光映水。",
            chinaStage4: "<strong>清华大学</strong><span class=\"uni-name\">清华大学</span><br>你带着团队启动科研计划，<br>和伙伴一起造机器人。<br>深夜的头脑风暴，<br>让你把知识变成了新的力量。",
            travelTitle: "中国 · 旅行日记",
            birthdayTitle: "生日快乐！",
            birthdayDesc: "愿这一年充满星光、惊喜与温柔回响",
            birthdayHint: "✨ 点击火焰 ✨",
            travelSummary: "从故宫的紫禁城到贵州的云雾山，从成都的暖阳到杭州的静湖，你带着爱人走过古街老巷，登山赏水。每一站都成为画卷里的一笔，让这个世界变得更真实、更温暖。",
            finalText: "二十一年的好奇、勇气与温柔——<br>从德国那个伸向天空的小男孩，<br>到懂得用语言、科技、棋盘和爱写故事的你。<br><br>每一条路都带你来到这里：<br>准备翻开下一页，<br>梦想更大，走得更远，<br>继续用你的光，点亮这个世界。<br><br><em>你的故事还在继续写——<br>最好的章节，还在前方。</em>",
            backButton: "← 返回地球",
            labelGermany: "德国",
            labelSwitzerland: "瑞士",
            labelFrance: "法国",
            labelSpain: "西班牙",
            labelChina: "中国",
            birthdayPoem: "二十二岁的你，\n正站在人生的十字路口，\n愿你勇敢前行，\n创造属于自己的精彩。",
            audioLabel: "生日旋律",
            audioToggleTitle: "打开音乐控制",
            audioToggleCloseTitle: "收起音乐控制",
            flightAlmostThere: "马上就到…",
            trainAlmostThere: "前方到站…",
            flightToSwiss: "飞往瑞士…",
            flightToFrance: "飞往法国…",
            flightToSpain: "飞往西班牙…",
            flightToChina: "飞往中国…",
            trainToTravel: "穿越中国山河…",
            trainToBirthday: "🎂 生日快乐…"
        },
        en: {
            mainTitle: "Lenni's Life Map",
            subtitleCn: "Explore · Experience · Growth · Future",
            subtitleEn: "Every place, a story. Every step, a part of you.",
            hintText: "Click on the markers on the globe to start exploring",
            orderHint: "Recommended to visit in chronological order",
            germanyTitle: "Lenni's Forest Hometown",
            germanyDesc: "Academic life in Germany",
            germanyPoem: "In the castles along the Rhine,\nI follow the footsteps of knowledge,\nEvery page carries dreams,\nEvery class lights up the future.",
            germanyCard1: "<strong>On the Swing</strong>You pointed up at the sky from your little swing,<br>as if telling the whole world:<br>One day, I'll go and see every place.",
            germanyCard2: "<strong>Home is People</strong>Surrounded by the ones who love you most,<br>you carry this warmth wherever you go.<br>Home is not just a place —<br>it's the people who stay.",
            germanyCard3: "<strong>Soft Corners</strong>Soft light fills every corner,<br>holding your smallest, sweetest memories.<br>This is where your heart<br>always feels at peace.",
            germanyCard4: "<strong>Where Stories Begin</strong>Quiet streets, gentle rain,<br>the place where your story began.<br>From here, you walked<br>toward the big, wide world.",
            germanyCard5: "<strong>Misty Morning</strong>Misty trees outside the window,<br>soft and quiet like a dream.<br>Even then, you knew<br>life held wonderful things ahead.",
            switzerlandTitle: "Switzerland · The Alps",
            switzerlandDesc: "Natural scenery of Switzerland",
            switzerlandPoem: "Switzerland Internship:\nYour AI Adventure ✨\nYou traded hometown mist for Swiss sunlight,\ntucking your love for code right into your pocket.\nAt the company, you wove AI into contract reviews—\nturning tedious work into something sharp, something new.\n\nColleagues smiled at your bright ideas,\nspotting the future in your lines of code.\nYears later, that small internship spark\nbloomed into a real partnership, steady and bold.\n\nFrom a curious intern in that neon shirt,\nto a trusted partner turning ideas into impact—\nSwitzerland didn't just give you that castle view.\nIt gave you the first chapter of your big tech story.",
            franceTitle: "France · City of Romance",
            franceDesc: "Art and culture of Paris",
            francePoem: "Your French Days ✨\nYou wandered alone through sunlit French streets,\nwhere the canals glowed gold and the mountains hummed soft.\nYou fell in love with baking cookies,\nkneading dough until your thumb was sore,\nand snapping endless selfies with your chocolate chips —\neach one a little celebration of joy.\n\nYou didn't just sightsee, though.\nYou sat in French classrooms,\nlearning the language of the place you'd grown to love,\none word, one sentence, one \"bonjour\" at a time.\n\nFrance gave you more than pretty views and warm cookies.\nIt gave you a new voice,\na new hobby,\nand a heart that felt a little more at home in the world.",
            spainTitle: "Spain · Passionate Nation",
            spainDesc: "Cultural heritage of Spain",
            spainPoem: "Your Spanish Days ✨\nYou wandered Barcelona's glowing nights,\nwhere Gaudí's dreamlike buildings lit up the dark.\nBy day, you learned Spanish, laughed with new friends,\nand let the city's golden light seep into your bones.\nYou fell in love with every corner,\neven vowing you'd return here one day to stay.",
            chessAchievement: "Your Chess Puzzle Book 🎯\nLong before or somewhere along your journey,\nyour teen curiosity bloomed into something extraordinary.\nFrom building an AI to crafting over 20 million chess puzzles,\nto seeing them published as a 5-star book —\nyou turned quiet late nights\ninto something even masters admire.",
            chinaTitle: "China · Academic Journey",
            chinaDesc: "Traditional Chinese culture",
            chinaPoem: "The Great Wall witnesses the long river of history,\nThe Forbidden City hides imperial secrets,\nThe Yangtze and Yellow Rivers nurtured Chinese civilization,\nThis is my root, my soul.",
            chinaStage1: "<strong>East China University of Science and Technology</strong><span class=\"uni-name\">华东理工大学</span><br>You stepped into Shanghai's bustle,<br>where friendships bloomed fast, and love found you too.<br>Your China story began here,<br>bright and warm, full of new firsts.",
            chinaStage2: "<strong>Fudan University</strong><span class=\"uni-name\">复旦大学</span><br>You kept building chess puzzles with AI,<br>turning millions of moves into three more books.<br>At Tsinghua's summer school, you studied LLMs,<br>and left with a quiet dream rooted in the campus light.",
            chinaStage3: "<strong>Nanjing University</strong><span class=\"uni-name\">南京大学</span><br>You and your love settled into a little nest,<br>exploring China's rivers and hills together.<br>Every view felt brighter with her beside you,<br>and every memory glowed like sunlight on water.",
            chinaStage4: "<strong>Tsinghua University</strong><span class=\"uni-name\">清华大学</span><br>You launched a research project backed by the school,<br>built robots with your team,<br>and turned late-night brainstorming into a partnership.<br>Tsinghua didn't just give you knowledge —<br>it gave you the space to build something new.",
            travelTitle: "China · Travel Diary",
            birthdayTitle: "Happy Birthday!",
            birthdayDesc: "",
            birthdayHint: "✨ click the flame ✨",
            travelSummary: "From the Forbidden City to misty Guizhou hills, from Chengdu's warm glow to Hangzhou's quiet lakes, you traced China's soul city by city. With your love by your side, you wandered old towns, climbed mountains, sipped tea in ancient courtyards, and laughed by the sea.",
            finalText: "Twenty-one years of curiosity, courage, and wonder —<br>from the little boy in Germany reaching for the sky,<br>to the traveler who speaks the world's languages,<br>builds AI puzzles, writes books, and loves deeply.<br><br>Every path led you here:<br>ready to turn the next page,<br>to dream bigger, wander farther,<br>and keep painting the world with your light.<br><br><em>Your story is still being written —<br>and the best chapters are yet to come.</em>",
            backButton: "← Back to Earth",
            labelGermany: "Germany",
            labelSwitzerland: "Switzerland",
            labelFrance: "France",
            labelSpain: "Spain",
            labelChina: "China",
            birthdayPoem: "You at twenty-two,\nStanding at life's crossroads,\nMay you bravely move forward,\nCreate your own wonderful life.",
            audioLabel: "Birthday Theme",
            audioToggleTitle: "Open music controls",
            audioToggleCloseTitle: "Collapse music controls",
            flightAlmostThere: "Almost there…",
            trainAlmostThere: "Arriving soon…",
            flightToSwiss: "Flying to Switzerland…",
            flightToFrance: "Flying to France…",
            flightToSpain: "Flying to Spain…",
            flightToChina: "Flying to China…",
            trainToTravel: "Crossing China's vast land…",
            trainToBirthday: "🎂 Happy Birthday…"
        }
    };

    let currentLanguage = 'en';
    const labelElements = {
        germany: byId('label-germany'),
        switzerland: byId('label-switzerland'),
        france: byId('label-france'),
        spain: byId('label-spain'),
        china: byId('label-china')
    };
    const labelMeta = [
        { key: 'germany', textKey: 'labelGermany', order: '①', dotClass: 'germany' },
        { key: 'switzerland', textKey: 'labelSwitzerland', order: '②', dotClass: 'switzerland' },
        { key: 'france', textKey: 'labelFrance', order: '③', dotClass: 'france' },
        { key: 'spain', textKey: 'labelSpain', order: '④', dotClass: 'spain' },
        { key: 'china', textKey: 'labelChina', order: '⑤', dotClass: 'china' }
    ];

    const pagesWrapper = byId('pagesWrapper');
    const flyOverlay = byId('flyOverlay');
    const flySky = byId('flySky');
    const flyText = byId('flyText');
    const flyPlaneWrapper = byId('flyPlaneWrapper');
    let animating = false;

    let exploded = false;
    let fireworks = [];
    let cakeWrapper = null;
    let candleFlame = null;
    let clickHint = null;
    let finalText = null;
    let canvas = null;
    let ctx = null;
    let globeController = null;

    function switchLanguage() {
        currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
        updateLanguage();
        updateLanguageButton();
    }

    function updateLanguage() {
        const lang = languages[currentLanguage];
        document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';

        setText(qs('.main-title'), lang.mainTitle);
        setText(qs('.subtitle-cn'), lang.subtitleCn);
        setText(qs('.subtitle-en'), lang.subtitleEn);
        setText(qs('.hint-text'), lang.hintText);
        setText(qs('.order-hint'), lang.orderHint);

        setText(qs('.germany-title'), lang.germanyTitle);
        setHTML(qs('.germany-copy-1'), lang.germanyCard1);
        setHTML(qs('.germany-copy-2'), lang.germanyCard2);
        setHTML(qs('.germany-copy-3'), lang.germanyCard3);
        setHTML(qs('.germany-copy-4'), lang.germanyCard4);
        setHTML(qs('.germany-copy-5'), lang.germanyCard5);
        setText(qs('.switzerland-title'), lang.switzerlandTitle);
        setHTML(qs('.switzerland-poem'), lang.switzerlandPoem.replace(/\n/g, '<br>'));
        setText(qs('.france-title'), lang.franceTitle);
        setHTML(qs('.france-poem'), lang.francePoem.replace(/\n/g, '<br>'));
        setText(qs('.spain-title'), lang.spainTitle);
        setHTML(qs('.spain-poem'), lang.spainPoem.replace(/\n/g, '<br>'));
        setHTML(qs('.chess-achievement'), lang.chessAchievement.replace(/\n/g, '<br>'));

        setText(qs('.china-title'), lang.chinaTitle);
        setHTML(qs('.stage-poem-1'), lang.chinaStage1);
        setHTML(qs('.stage-poem-2'), lang.chinaStage2);
        setHTML(qs('.stage-poem-3'), lang.chinaStage3);
        setHTML(qs('.stage-poem-4'), lang.chinaStage4);

        setText(qs('.travel-title'), lang.travelTitle);
        setHTML(qs('.travel-summary'), lang.travelSummary);
        initPhotoWall();

        setText(qs('.birthday-title'), lang.birthdayTitle);
        const birthdayDesc = byId('birthdayDesc');
        setText(birthdayDesc, lang.birthdayDesc);
        if (birthdayDesc) {
            birthdayDesc.hidden = !lang.birthdayDesc;
        }
        setText(byId('clickHint'), lang.birthdayHint);
        setHTML(byId('finalText'), lang.finalText);
        setText(byId('audioLabel'), lang.audioLabel);

        document.querySelectorAll('.back-btn').forEach((button) => {
            button.textContent = lang.backButton;
        });

        labelMeta.forEach(({ key, textKey, order, dotClass }) => {
            const label = labelElements[key];
            if (!label) {
                return;
            }
            label.innerHTML = `<span class="order-num">${order}</span><span class="label-dot ${dotClass}"></span>${lang[textKey]}`;
        });
    }

    function updateLanguageButton() {
        const button = byId('languageSwitch');
        if (button) {
            button.textContent = currentLanguage === 'zh' ? 'EN' : '中';
            button.title = currentLanguage === 'zh' ? 'Switch to English' : '切换到中文';
        }

        const audioToggle = byId('audioToggle');
        const audioPlayer = byId('audioPlayer');
        if (audioToggle && audioPlayer) {
            const expanded = !audioPlayer.classList.contains('collapsed');
            audioToggle.title = expanded
                ? languages[currentLanguage].audioToggleCloseTitle
                : languages[currentLanguage].audioToggleTitle;
        }
    }

    function initLanguage() {
        bindIfPresent(byId('languageSwitch'), 'click', switchLanguage);
        updateLanguageButton();
        updateLanguage();
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        document.querySelectorAll('.page').forEach((page) => {
            page.scrollTop = 0;
        });
    }

    function goToPage(pageClass) {
        if (globeController) {
            globeController.pause();
        }
        if (pagesWrapper) {
            pagesWrapper.className = `pages-wrapper ${pageClass}`;
        }
        scrollToTop();
    }

    function returnToGlobe() {
        if (pagesWrapper) {
            pagesWrapper.className = 'pages-wrapper';
        }
        scrollToTop();
        if (globeController) {
            globeController.resume();
        }
    }

    function startFlight(backgroundUrl, text, targetClass) {
        if (animating) {
            return;
        }
        if (!flyOverlay || !flySky || !flyText) {
            goToPage(targetClass);
            return;
        }

        if (flyPlaneWrapper) {
            flyPlaneWrapper.classList.add('flight-mode');
            flyPlaneWrapper.classList.remove('train-mode');
            const miniPlane = flyPlaneWrapper.querySelector('.mini-plane');
            const kidOnPlane = flyPlaneWrapper.querySelector('.kid-on-plane');
            if (miniPlane) miniPlane.textContent = '✈️';
            if (kidOnPlane) kidOnPlane.textContent = '👦🏼';
        }
        flySky.classList.remove('train-mode');

        animating = true;
        flySky.style.backgroundImage = `url('${backgroundUrl}'), linear-gradient(180deg, #b0c4de 0%, #e6f0fa 100%)`;
        flyText.textContent = text;
        flyOverlay.classList.add('active');

        setTimeout(() => {
            flyText.textContent = languages[currentLanguage].flightAlmostThere;
        }, 1500);

        setTimeout(() => {
            flyOverlay.classList.remove('active');
            animating = false;
            goToPage(targetClass);
        }, 3000);
    }

    function startTrain(backgroundUrl, text, targetClass) {
        if (animating) {
            return;
        }
        if (!flyOverlay || !flySky || !flyText) {
            goToPage(targetClass);
            return;
        }

        if (flyPlaneWrapper) {
            flyPlaneWrapper.classList.add('train-mode');
            flyPlaneWrapper.classList.remove('flight-mode');
            const miniPlane = flyPlaneWrapper.querySelector('.mini-plane');
            const kidOnPlane = flyPlaneWrapper.querySelector('.kid-on-plane');
            if (miniPlane) miniPlane.textContent = '🚆';
            if (kidOnPlane) kidOnPlane.textContent = '👦🏼';
        }
        flySky.classList.add('train-mode');

        animating = true;
        flySky.style.backgroundImage = `url('${backgroundUrl}'), linear-gradient(180deg, #b0c4de 0%, #e6f0fa 100%)`;
        flyText.textContent = text;
        flyOverlay.classList.add('active');

        setTimeout(() => {
            flyText.textContent = languages[currentLanguage].trainAlmostThere;
        }, 1500);

        setTimeout(() => {
            flyOverlay.classList.remove('active');
            animating = false;
            goToPage(targetClass);
        }, 3000);
    }

    function startCakeTransition(backgroundUrl, text, targetClass) {
        if (animating) {
            return;
        }
        if (!flyOverlay || !flySky || !flyText) {
            goToPage(targetClass);
            return;
        }

        if (flyPlaneWrapper) {
            flyPlaneWrapper.classList.remove('flight-mode', 'train-mode');
            const miniPlane = flyPlaneWrapper.querySelector('.mini-plane');
            const kidOnPlane = flyPlaneWrapper.querySelector('.kid-on-plane');
            if (miniPlane) miniPlane.textContent = '🎂';
            if (kidOnPlane) kidOnPlane.textContent = '👦🏼';
        }
        flySky.classList.remove('train-mode');

        animating = true;
        flySky.style.backgroundImage = `url('${backgroundUrl}'), linear-gradient(180deg, #b0c4de 0%, #e6f0fa 100%)`;
        flyText.textContent = text;
        flyOverlay.classList.add('active');

        setTimeout(() => {
            flyText.textContent = languages[currentLanguage].trainAlmostThere;
        }, 1500);

        setTimeout(() => {
            flyOverlay.classList.remove('active');
            animating = false;
            goToPage(targetClass);
        }, 3000);
    }

    function resetBirthdayScene() {
        exploded = false;
        fireworks = [];

        if (!cakeWrapper || !candleFlame || !clickHint || !finalText) {
            return;
        }

        cakeWrapper.classList.remove('exploded');
        cakeWrapper.style.transform = 'scale(1)';
        candleFlame.style.animation = 'flicker 0.3s infinite alternate';
        candleFlame.style.opacity = '1';
        candleFlame.style.boxShadow = '0 0 20px rgba(255,180,60,0.7),0 0 45px rgba(255,150,30,0.4)';
        clickHint.style.opacity = '1';
        clickHint.textContent = languages[currentLanguage].birthdayHint;
        finalText.classList.remove('visible');
        document.querySelectorAll('.confetti-piece').forEach((piece) => piece.remove());
    }

    function initNavigation() {
        [
            'backFromGermany',
            'backFromSwiss',
            'backFromFrance',
            'backFromSpain',
            'backFromChina',
            'backFromTravel',
            'backFromBirthday'
        ].forEach((id) => {
            bindIfPresent(byId(id), 'click', returnToGlobe);
        });

        bindIfPresent(byId('planeToSwiss'), 'click', (event) => {
            event.stopPropagation();
            startFlight('assets/images/fly-switzerland.jpg', languages[currentLanguage].flightToSwiss, 'page-3-active');
        });

        bindIfPresent(byId('planeToFrance'), 'click', (event) => {
            event.stopPropagation();
            startFlight('assets/images/fly-france.jpg', languages[currentLanguage].flightToFrance, 'page-4-active');
        });

        bindIfPresent(byId('planeToSpain'), 'click', (event) => {
            event.stopPropagation();
            startFlight('assets/images/fly-spain.jpg', languages[currentLanguage].flightToSpain, 'page-5-active');
        });

        bindIfPresent(byId('planeToChina'), 'click', (event) => {
            event.stopPropagation();
            startFlight('assets/images/fly-china.jpg', languages[currentLanguage].flightToChina, 'page-6-active');
        });

        bindIfPresent(byId('trainToTravel'), 'click', (event) => {
            event.stopPropagation();
            startTrain('assets/images/train-china.jpg', languages[currentLanguage].trainToTravel, 'page-7-active');
        });

        bindIfPresent(byId('cakeTrigger'), 'click', (event) => {
            event.stopPropagation();
            resetBirthdayScene();
            startCakeTransition('assets/images/fly-birthday.jpg', languages[currentLanguage].trainToBirthday, 'page-8-active');
        });
    }

    async function initGlobe() {
        const globeContainer = byId('globe-container');
        if (!globeContainer) {
            return null;
        }

        const THREE = await import('https://esm.sh/three@0.160.0');
        const { OrbitControls } = await import('https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js');

        const getGlobeSize = () => ({
            width: Math.max(globeContainer.clientWidth, 1),
            height: Math.max(globeContainer.clientHeight, 1)
        });

        const { width, height } = getGlobeSize();
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#FFF8F0');

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.5, 60);
        camera.position.set(3.5, 2.8, 9.5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        globeContainer.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight('#FFF5EC', 2.8));
        scene.add(new THREE.HemisphereLight('#FFF8F0', '#C4A882', 1.6));
        const sun = new THREE.DirectionalLight('#FFFDF5', 4.5);
        sun.position.set(8, 6, 5);
        scene.add(sun);

        const earthGroup = new THREE.Group();
        scene.add(earthGroup);

        const earthRadius = 3.2;
        const earthGeom = new THREE.SphereGeometry(earthRadius, 96, 72);
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 1024;
        fallbackCanvas.height = 512;
        const fallbackContext = fallbackCanvas.getContext('2d');
        if (fallbackContext) {
            fallbackContext.fillStyle = '#F5E8D8';
            fallbackContext.fillRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);
        }

        const earthTexture = new THREE.CanvasTexture(fallbackCanvas);
        earthTexture.colorSpace = THREE.SRGBColorSpace;
        const earthMat = new THREE.MeshStandardMaterial({
            map: earthTexture,
            roughness: 0.65,
            color: new THREE.Color('#FFFDF8')
        });
        const earthMesh = new THREE.Mesh(earthGeom, earthMat);
        earthGroup.add(earthMesh);

        const textureLoader = new THREE.TextureLoader();
        const localizedEarthTexture = window.__EARTH_TEXTURE_DATA_URL__ || 'assets/textures/earth_atmos_2048.jpg';
        textureLoader.load(
            localizedEarthTexture,
            (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                earthMat.map = texture;
                earthMat.needsUpdate = true;
            },
            undefined,
            (error) => {
                console.warn('Earth texture failed to load, using fallback texture.', error);
            }
        );

        earthGroup.add(new THREE.Mesh(
            new THREE.SphereGeometry(earthRadius + 0.12, 64, 48),
            new THREE.ShaderMaterial({
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vWorldPosition;
                    void main() {
                        vec4 wPos = modelMatrix * vec4(position, 1.0);
                        vWorldPosition = wPos.xyz;
                        vNormal = normalize(mat3(modelMatrix) * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vNormal;
                    varying vec3 vWorldPosition;
                    void main() {
                        vec3 vDir = normalize(cameraPosition - vWorldPosition);
                        float f = pow(1.0 - abs(dot(vDir, vNormal)), 3.5);
                        gl_FragColor = vec4(mix(vec3(1.0, 0.94, 0.85), vec3(0.96, 0.82, 0.68), f), f * 0.28);
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        ));

        const countriesData = [
            { name: 'germany', lat: 51, lon: 10, color: '#E8947A' },
            { name: 'switzerland', lat: 47, lon: 8, color: '#A8C9B8' },
            { name: 'france', lat: 47, lon: 2, color: '#D5A8C9' },
            { name: 'spain', lat: 40, lon: -4, color: '#F0C78E' },
            { name: 'china', lat: 35, lon: 105, color: '#E8B4A0' }
        ];

        function latLonToVec3(lat, lon, radius) {
            const phi = (90 - lat) * Math.PI / 180;
            return new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, phi, lon * Math.PI / 180));
        }

        const markersData = [];
        const hitSpheres = [];
        const markerPositions = [];

        countriesData.forEach((country) => {
            const position = latLonToVec3(country.lat, country.lon, earthRadius + 0.04);
            markerPositions.push(position.clone());

            const group = new THREE.Group();
            group.position.copy(position);
            group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());

            const core = new THREE.Mesh(
                new THREE.SphereGeometry(0.07, 20, 14),
                new THREE.MeshStandardMaterial({
                    color: country.color,
                    emissive: country.color,
                    emissiveIntensity: 0.7
                })
            );
            group.add(core);

            group.add(new THREE.Mesh(
                new THREE.TorusGeometry(0.14, 0.025, 16, 40),
                new THREE.MeshStandardMaterial({
                    color: country.color,
                    emissive: country.color,
                    emissiveIntensity: 0.5,
                    transparent: true,
                    opacity: 0.75
                })
            ));

            group.add(new THREE.Mesh(
                new THREE.TorusGeometry(0.19, 0.018, 12, 36),
                new THREE.MeshStandardMaterial({
                    color: country.color,
                    emissive: country.color,
                    emissiveIntensity: 0.35,
                    transparent: true,
                    opacity: 0.5
                })
            ));

            const hit = new THREE.Mesh(
                new THREE.SphereGeometry(0.38, 16, 16),
                new THREE.MeshBasicMaterial({ visible: false })
            );
            hit.userData = { country: country.name };
            group.add(hit);
            hitSpheres.push(hit);

            earthGroup.add(group);
            markersData.push({ name: country.name, group, worldPos: new THREE.Vector3(), core });
        });

        for (let i = 0; i < markerPositions.length - 1; i += 1) {
            const p1 = markerPositions[i];
            const p2 = markerPositions[i + 1];
            const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar((earthRadius + 0.08) * 1.06);
            const curve = new THREE.QuadraticBezierCurve3(
                p1.clone().normalize().multiplyScalar(earthRadius + 0.08),
                mid,
                p2.clone().normalize().multiplyScalar(earthRadius + 0.08)
            );
            const points = curve.getPoints(40);
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            const mat = new THREE.LineDashedMaterial({
                color: 0xC8A882,
                dashSize: 0.25,
                gapSize: 0.18,
                transparent: true,
                opacity: 0.7
            });
            const line = new THREE.Line(geo, mat);
            line.computeLineDistances();
            earthGroup.add(line);
        }

        const starsGeo = new THREE.BufferGeometry();
        const starsPos = new Float32Array(500 * 3);
        for (let i = 0; i < 500; i += 1) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 7 + Math.random() * 14;
            starsPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            starsPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            starsPos[i * 3 + 2] = radius * Math.cos(phi);
        }
        starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));

        const stars = new THREE.Points(
            starsGeo,
            new THREE.PointsMaterial({
                color: '#FFF5E8',
                size: 0.28,
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: 0.7
            })
        );
        scene.add(stars);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0.15, 0);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.35;
        controls.minDistance = 6;
        controls.maxDistance = 14;
        controls.enablePan = false;
        controls.minPolarAngle = 0.5;
        controls.maxPolarAngle = 2.2;
        controls.minAzimuthAngle = -0.2;
        controls.maxAzimuthAngle = 2.0;
        controls.update();
        controls.addEventListener('change', () => {
            const angle = controls.getAzimuthalAngle();
            if (angle >= controls.maxAzimuthAngle - 0.08 && controls.autoRotateSpeed > 0) {
                controls.autoRotateSpeed *= -1;
            } else if (angle <= controls.minAzimuthAngle + 0.08 && controls.autoRotateSpeed < 0) {
                controls.autoRotateSpeed *= -1;
            }
        });

        function worldToScreen(worldPosition) {
            const vector = worldPosition.clone().project(camera);
            const halfWidth = globeContainer.clientWidth / 2;
            const halfHeight = globeContainer.clientHeight / 2;
            return {
                x: (vector.x * halfWidth) + halfWidth,
                y: -(vector.y * halfHeight) + halfHeight,
                visible: vector.z < 1 && vector.z > 0
            };
        }

        function isBack(worldPosition) {
            return worldPosition.clone().normalize().dot(camera.position.clone().normalize()) < -0.05;
        }

        const raycaster = new THREE.Raycaster();
        const pointerDown = new THREE.Vector2();
        let dragging = false;

        renderer.domElement.addEventListener('pointerdown', (event) => {
            pointerDown.set(event.clientX, event.clientY);
            dragging = false;
        });

        renderer.domElement.addEventListener('pointermove', (event) => {
            if (Math.abs(event.clientX - pointerDown.x) > 4 || Math.abs(event.clientY - pointerDown.y) > 4) {
                dragging = true;
            }
        });

        renderer.domElement.addEventListener('pointerup', (event) => {
            if (dragging) {
                return;
            }

            const rect = renderer.domElement.getBoundingClientRect();
            const mouse = new THREE.Vector2(
                ((event.clientX - rect.left) / rect.width) * 2 - 1,
                -(((event.clientY - rect.top) / rect.height) * 2 - 1)
            );
            raycaster.setFromCamera(mouse, camera);
            const intersections = raycaster.intersectObjects(hitSpheres);
            if (intersections.length === 0) {
                return;
            }

            const country = intersections[0].object.userData.country;
            if (country === 'germany') {
                goToPage('page-2-active');
            } else if (country === 'switzerland') {
                goToPage('page-3-active');
            } else if (country === 'france') {
                goToPage('page-4-active');
            } else if (country === 'spain') {
                goToPage('page-5-active');
            } else if (country === 'china') {
                goToPage('page-6-active');
            }
        });

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            markersData.forEach((marker) => marker.group.getWorldPosition(marker.worldPos));
            stars.rotation.y += 0.001;

            markersData.forEach((marker) => {
                const label = labelElements[marker.name];
                if (!label) {
                    return;
                }
                const screenPosition = worldToScreen(marker.worldPos);
                if (screenPosition.visible && !isBack(marker.worldPos)) {
                    label.classList.remove('hidden-label');
                    label.style.left = `${screenPosition.x}px`;
                    label.style.top = `${screenPosition.y - 22}px`;
                } else {
                    label.classList.add('hidden-label');
                }
            });

            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            const nextSize = getGlobeSize();
            camera.aspect = nextSize.width / nextSize.height;
            camera.updateProjectionMatrix();
            renderer.setSize(nextSize.width, nextSize.height);
        });

        camera.position.copy(latLonToVec3(40, 8, 9.5));
        controls.target.set(0, 0.15, 0);
        controls.update();
        requestAnimationFrame(animate);

        return { scene, camera, renderer, controls };
    }

    function initPhotoWall() {
        const cities = [
            { name: 'Beijing', nameZh: '北京', img: 'assets/images/beijing.jpg' },
            { name: 'Chengdu', nameZh: '成都', img: 'assets/images/chengdu.jpg' },
            { name: 'Chengde', nameZh: '承德', img: 'assets/images/chengde.jpg' },
            { name: 'Guiyang', nameZh: '贵阳', img: 'assets/images/guiyang.jpg' },
            { name: 'Hangzhou', nameZh: '杭州', img: 'assets/images/hangzhou.jpg' },
            { name: 'Jinan', nameZh: '济南', img: 'assets/images/jinan.jpg' },
            { name: 'Jeju', nameZh: '济州', img: 'assets/images/jeju.jpg' },
            { name: 'Kaili', nameZh: '凯里', img: 'assets/images/kaili.jpg' },
            { name: 'Nanjing', nameZh: '南京', img: 'assets/images/nanjing.jpg' },
            { name: 'Liaoning Chaoyang', nameZh: '辽宁朝阳', img: 'assets/images/liaoning-chaoyang.jpg' },
            { name: 'Qinhuangdao', nameZh: '秦皇岛', img: 'assets/images/qinhuangdao.jpg' },
            { name: 'Shenzhen', nameZh: '深圳', img: 'assets/images/shenzhen.jpg' },
            { name: 'Tangshan', nameZh: '唐山', img: 'assets/images/tangshan.jpg' },
            { name: 'Tianjin', nameZh: '天津', img: 'assets/images/tianjin.jpg' },
            { name: 'Wuhan', nameZh: '武汉', img: 'assets/images/wuhan.jpg' },
            { name: 'Hong Kong', nameZh: '香港', img: 'assets/images/hong-kong.jpg' },
            { name: 'Yangzhou', nameZh: '扬州', img: 'assets/images/yangzhou.jpg' },
            { name: 'Yiwu', nameZh: '义乌', img: 'assets/images/yiwu.jpg' },
            { name: 'Zhangqiu', nameZh: '章丘', img: 'assets/images/zhangqiu.jpg' },
            { name: 'Changsha', nameZh: '长沙', img: 'assets/images/changsha.jpg' },
            { name: 'Chongqing', nameZh: '重庆', img: 'assets/images/chongqing.jpg' },
            { name: 'Zhoushan', nameZh: '舟山', img: 'assets/images/zhoushan.jpg' }
        ];

        const photoWall = byId('photoWall');
        if (!photoWall) {
            return;
        }

        photoWall.innerHTML = '';
        cities.forEach((city) => {
            const card = document.createElement('div');
            card.className = 'city-card';
            card.style.transform = `rotate(${(Math.random() - 0.5) * 8}deg)`;

            const imgStyle = city.img.includes('guiyang.jpg') || city.img.includes('wuhan.jpg')
                ? ' style="object-position: top;"'
                : '';

            const cityName = currentLanguage === 'zh' ? city.nameZh || city.name : city.name;
            card.innerHTML = `<div class="card-img"><img src="${city.img}" alt="${cityName}"${imgStyle}></div><div class="card-name">${cityName}</div>`;
            photoWall.appendChild(card);
        });
    }

    function initBirthdayScene() {
        cakeWrapper = byId('cakeWrapper');
        candleFlame = byId('candleFlame');
        clickHint = byId('clickHint');
        finalText = byId('finalText');
        canvas = byId('fireworkCanvas');
        ctx = canvas ? canvas.getContext('2d') : null;

        if (!cakeWrapper || !candleFlame || !clickHint || !finalText || !canvas || !ctx) {
            return;
        }

        function resizeCanvas() {
            if (!canvas) {
                return;
            }
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function spawnConfetti() {
            const rect = cakeWrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const colors = ['#FFB3B3', '#FFD4A8', '#FFE8B0', '#FFC8D6', '#D5C8E0', '#C8E0D5', '#FFE4C4', '#F8C8D8', '#FFF5C0'];

            for (let i = 0; i < 100; i += 1) {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                piece.style.left = `${centerX}px`;
                piece.style.top = `${centerY}px`;
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.width = `${8 + Math.random() * 14}px`;
                piece.style.height = `${6 + Math.random() * 10}px`;
                piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';

                const angle = Math.random() * Math.PI * 2;
                const distance = 200 + Math.random() * 500;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance - 300 - Math.random() * 400;

                piece.style.setProperty('--dx', `${dx}px`);
                piece.style.setProperty('--dy', `${dy}px`);
                piece.style.setProperty('--dx30', `${dx * 0.3}px`);
                piece.style.setProperty('--dy30', `${dy * 0.3}px`);
                piece.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
                piece.style.setProperty('--r30', `${Math.random() * 360 - 180}deg`);
                piece.style.animation = `confettiFall ${2 + Math.random() * 3}s ease-out forwards`;

                document.body.appendChild(piece);
                setTimeout(() => piece.remove(), 4000);
            }
        }

        function spawnFireworks() {
            const rect = cakeWrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            for (let burst = 0; burst < 6; burst += 1) {
                setTimeout(() => {
                    const burstX = centerX + (Math.random() - 0.5) * 200;
                    const burstY = centerY + (Math.random() - 0.5) * 150;
                    const color = ['#FFB3B3', '#FFD4A8', '#FFE8B0', '#FFC8D6', '#D5C8E0', '#FFF5C0'][Math.floor(Math.random() * 6)];

                    for (let i = 0; i < 70; i += 1) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 3 + Math.random() * 8;
                        fireworks.push({
                            x: burstX,
                            y: burstY,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            life: 1,
                            decay: 0.008 + Math.random() * 0.02,
                            color,
                            size: 2 + Math.random() * 4
                        });
                    }
                }, burst * 200);
            }
        }

        function startContinuousFireworks() {
            const rect = cakeWrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const interval = setInterval(() => {
                if (!exploded) {
                    clearInterval(interval);
                    return;
                }

                const burstX = centerX + (Math.random() - 0.5) * 400;
                const burstY = centerY + (Math.random() - 0.5) * 300 - 100;
                const color = ['#FFB3B3', '#FFD4A8', '#FFE8B0', '#FFC8D6', '#D5C8E0', '#FFF5C0', '#FFDDE4'][Math.floor(Math.random() * 7)];

                for (let i = 0; i < 50; i += 1) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 2 + Math.random() * 6;
                    fireworks.push({
                        x: burstX,
                        y: burstY,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life: 1,
                        decay: 0.01 + Math.random() * 0.025,
                        color,
                        size: 1.5 + Math.random() * 3
                    });
                }
            }, 800);

            setTimeout(() => clearInterval(interval), 12000);
        }

        function updateFireworks() {
            if (!ctx || !canvas) {
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = fireworks.length - 1; i >= 0; i -= 1) {
                const firework = fireworks[i];
                firework.x += firework.vx;
                firework.y += firework.vy;
                firework.vy += 0.06;
                firework.life -= firework.decay;

                if (firework.life <= 0) {
                    fireworks.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(firework.x, firework.y, 3 * firework.life, 0, Math.PI * 2);
                const r = parseInt(firework.color.slice(1, 3), 16);
                const g = parseInt(firework.color.slice(3, 5), 16);
                const b = parseInt(firework.color.slice(5, 7), 16);
                ctx.fillStyle = `rgba(${r},${g},${b},${firework.life})`;
                ctx.fill();
            }

            requestAnimationFrame(updateFireworks);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        bindIfPresent(candleFlame, 'click', (event) => {
            event.stopPropagation();
            if (exploded) {
                return;
            }

            exploded = true;
            clickHint.style.opacity = '0';
            candleFlame.style.animation = 'none';
            candleFlame.style.opacity = '0';
            candleFlame.style.boxShadow = 'none';
            cakeWrapper.classList.add('exploded');

            spawnConfetti();
            spawnFireworks();

            setTimeout(() => {
                finalText.classList.add('visible');
            }, 600);

            setTimeout(() => {
                startContinuousFireworks();
            }, 2000);
        });

        updateFireworks();
    }

    function initAudio() {
        const backgroundAudio = byId('backgroundAudio');
        const audioPlayer = byId('audioPlayer');
        const audioToggle = byId('audioToggle');
        let hasTriedAutoPlay = false;

        if (backgroundAudio) {
            backgroundAudio.volume = 0.35;
            backgroundAudio.loop = true;
        }

        function syncAudioUi() {
            if (!audioPlayer || !audioToggle) {
                return;
            }

            const isPlaying = Boolean(backgroundAudio && !backgroundAudio.paused);
            audioPlayer.classList.toggle('is-playing', isPlaying);
            audioToggle.setAttribute('aria-expanded', audioPlayer.classList.contains('collapsed') ? 'false' : 'true');
            audioToggle.title = audioPlayer.classList.contains('collapsed')
                ? languages[currentLanguage].audioToggleTitle
                : languages[currentLanguage].audioToggleCloseTitle;
        }

        function tryAutoPlayOnFirstInteraction() {
            if (hasTriedAutoPlay || !backgroundAudio) {
                return;
            }

            hasTriedAutoPlay = true;
            backgroundAudio.play().catch(() => {});
        }

        bindIfPresent(audioToggle, 'click', () => {
            if (!audioPlayer) {
                return;
            }
            audioPlayer.classList.toggle('collapsed');
            syncAudioUi();
        });

        if (backgroundAudio) {
            backgroundAudio.addEventListener('play', syncAudioUi);
            backgroundAudio.addEventListener('pause', syncAudioUi);
            backgroundAudio.addEventListener('ended', syncAudioUi);
        }

        document.addEventListener('pointerdown', tryAutoPlayOnFirstInteraction, { once: true });
        document.addEventListener('keydown', tryAutoPlayOnFirstInteraction, { once: true });

        syncAudioUi();
    }

    runInitStep('language controls', initLanguage);
    runInitStep('page navigation', initNavigation);
    runInitStep('globe scene', initGlobe);
    runInitStep('photo wall', initPhotoWall);
    runInitStep('birthday scene', initBirthdayScene);
    runInitStep('audio controls', initAudio);
})().catch((error) => {
    console.error('Failed to initialize Lenni Life Map:', error);
});
