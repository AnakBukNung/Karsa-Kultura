let ARTICLES_DATA = [];

const state = {
    currentView: 'home',
    selectedCategory: 'Semua',
    selectedTag: null,
    searchQuery: '',
    currentArticle: null,
    articleFontSerif: true,
    bookmarks: JSON.parse(localStorage.getItem('karsa_bookmarks') || '[]')
};

let isSpeaking = false;
let currentUtterance = null;

function calculateReadingTime(contentHtml) {
    if (!contentHtml) return '1 MIN READ';
    const text = contentHtml.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 180);
    return `${minutes} MIN READ`;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
}

async function loadArticlesData() {
    try {
        const response = await fetch('data/articles.json');
        if (!response.ok) throw new Error('Gagal memuat file JSON');
        ARTICLES_DATA = await response.json();
    } catch (err) {
        console.warn("Fetch local JSON failed or running from file:// protocol. Fallback sample data will be loaded.", err);
        ARTICLES_DATA = [
            {
                id: "art-1",
                title: "Eksplorasi Musik Lokal di Era Digital: Apa yang Berubah?",
                slug: "eksplorasi-musik-lokal-di-era-digital",
                excerpt: "Bagaimana musisi independen memanfaatkan platform digital untuk menjangkau pendengar global tanpa kehilangan jati diri budaya.",
                content: `<p>Perkembangan teknologi digital telah mengubah lanskap industri musik secara mendasar. Musisi independen kini memiliki akses langsung ke pendengar global tanpa tergantung pada label rekam konvensional.</p><h2>Transformasi Media & Platform</h2><p>Dengan hadirnya platform streaming dan media sosial, narasi musik lokal kini dapat dinikmati oleh berbagai kalangan tanpa batasan geografis.</p><blockquote>"Digitalisasi bukan sekadar distribusi, melainkan panggung baru bagi kebudayaan lokal."</blockquote><p>Tantangan berikutnya adalah bagaimana menjaga nilai otentisitas karya di tengah gelombang arus utama yang serba cepat.</p>`,
                featuredImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
                category: "MUSIC",
                tags: ["Musik", "Digital", "Indie"],
                author: { name: "Rian Kusuma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
                publishedAt: "2026-07-20",
                isFeatured: false
            },
            {
                id: "art-2",
                title: "Satu pria tampan dari loteng dan 2 umbul umbul lanyangan.",
                slug: "satu-pria-tampan-dari-loteng",
                excerpt: "Ringkasan singkat mengenai berita utama yang sedang hangat dibicarakan hari ini di industri musik dan seni...",
                content: `<p>Sebuah fenomena unik kembali menyita perhatian publik seni dan kebudayaan. Narasi visual yang dihadirkan melalui simbolisme umbul-umbul lanyangan menggugah ruang diskusi mengenai tradisi dan ruang modernitas.</p><h2>Makna Visual dan Refleksi Ruang</h2><p>Karya ini mengeksplorasi perjumpaan antara ruang personal (loteng) dan ruang publik yang direpresentasikan oleh simbolik umbul-umbul.</p><p>Pengunjung diajak untuk merenungkan kembali bagaimana identitas lokal dibentuk di tengah dinamika perkotaan.</p>`,
                featuredImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80",
                category: "CULTURE",
                tags: ["Seni", "Budaya", "Pameran"],
                author: { name: "Redaksi Karsa Kultura", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
                publishedAt: "2026-07-22",
                isFeatured: true
            },
            {
                id: "art-3",
                title: "Pameran Seni Kontemporer yang Mengguncang Masbagik.",
                slug: "pameran-seni-kontemporer-masbagik",
                excerpt: "Seniman muda berkumpul menyajikan instalasi interaktif yang memadukan elemen material lokal dan narasi futuristik.",
                content: `<p>Gelaran seni kontemporer di Masbagik menjadi sorotan pecinta seni tanah air. Ratusan karya interaktif dipamerkan selama satu pekan penuh.</p><h2>Seni Sebagai Medium Komunikasi</h2><p>Melalui pameran ini, para kreator muda ingin membuktikan bahwa daerah bukan hambatan untuk menghasilkan karya berstandar internasional.</p>`,
                featuredImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80",
                category: "ART",
                tags: ["Kontemporer", "Galeri", "Visual"],
                author: { name: "Siti Nurhaliza", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
                publishedAt: "2026-07-18",
                isFeatured: false
            },
            {
                id: "art-4",
                title: "Tips Menjaga Kreativitas di Tengah Kesibukan Urban.",
                slug: "tips-menjaga-kreativitas-urban",
                excerpt: "Rutinitas perkotaan acapkali menguras energi kreatif. Simak panduan praktis untuk merawat percik ide di sela padatnya aktivitas.",
                content: `<p>Menjaga stamina kreatif di tengah hiruk-pikuk kehidupan kota modern membutuhkan strategi pembagian waktu dan kesadaran diri yang baik.</p><h2>Ruang Hening & Rehat Sejenak</h2><p>Menyediakan waktu 15 menit setiap pagi tanpa gawai dapat membantu menata kembali pikiran dan memicu ide-ide segar.</p>`,
                featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80",
                category: "LIFESTYLE",
                tags: ["Gaya Hidup", "Kreatif", "Urban"],
                author: { name: "Budi Santoso", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
                publishedAt: "2026-07-15",
                isFeatured: false
            }
        ];
    }
    renderHomepage();
}

function renderHeroSection() {
    const heroContainer = document.getElementById('heroHeadlineSection');
    const headlineArt = ARTICLES_DATA.find(a => a.isFeatured) || ARTICLES_DATA[0];

    if (!headlineArt || state.selectedCategory !== 'Semua') {
        heroContainer.innerHTML = '';
        heroContainer.classList.add('hidden');
        return;
    }
    heroContainer.classList.remove('hidden');

    const isBookmarked = state.bookmarks.some(b => b.id === headlineArt.id);

    heroContainer.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-6 relative group cursor-pointer overflow-hidden rounded-none shadow-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900" onclick="navigateTo('article', '${headlineArt.slug}')">
                <img src="${headlineArt.featuredImage}" alt="${headlineArt.title}" class="w-full h-[320px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                <div class="absolute top-4 left-4 bg-brand-coral/90 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
                    TERBARU
                </div>
            </div>

            <div class="lg:col-span-6 space-y-4">
                <div class="flex items-center space-x-3">
                    <span class="text-white font-black text-xs tracking-widest uppercase bg-white/10 dark:bg-white/10 px-3 py-1 rounded-full">
                        HEADLINE
                    </span>
                    <span class="text-zinc-400 text-xs font-mono">${formatDate(headlineArt.publishedAt)}</span>
                </div>

                <h1 onclick="navigateTo('article', '${headlineArt.slug}')" class="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white leading-[1.15] font-display hover:text-brand-coral cursor-pointer transition-colors">
                    ${headlineArt.title}
                </h1>

                <p class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans max-w-xl">
                    ${headlineArt.excerpt}
                </p>

                <div class="pt-3 flex items-center space-x-4">
                    <button onclick="navigateTo('article', '${headlineArt.slug}')" class="px-7 py-3.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-extrabold uppercase tracking-widest rounded-full hover:bg-brand-coral dark:hover:bg-brand-coral dark:hover:text-white transition-all shadow-md">
                        BACA SELENGKAPNYA <i class="fa-solid fa-arrow-right ml-2 text-[10px]"></i>
                    </button>
                    <button onclick="toggleBookmark('${headlineArt.id}')" class="p-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-brand-coral transition-colors" title="Bookmark">
                        <i class="${isBookmarked ? 'fa-solid text-brand-coral' : 'fa-regular'} fa-bookmark text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = "flex flex-col space-y-3 group cursor-pointer bg-white dark:bg-zinc-900/60 p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 hover:shadow-xl transition-all duration-300";
    
    const isBookmarked = state.bookmarks.some(b => b.id === article.id);

    card.innerHTML = `
        <div class="relative overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 h-48" onclick="navigateTo('article', '${article.slug}')">
            <img src="${article.featuredImage}" alt="${article.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <button onclick="event.stopPropagation(); toggleBookmark('${article.id}')" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-brand-coral transition-colors shadow">
                <i class="${isBookmarked ? 'fa-solid text-brand-coral' : 'fa-regular'} fa-bookmark text-xs"></i>
            </button>
        </div>

        <div class="flex items-center justify-between text-[11px] pt-1">
            <span class="text-brand-coral dark:text-white font-extrabold tracking-widest uppercase bg-black/10 dark:bg-white/10 px-2.5 py-0.5 rounded-full">
                ${article.category}
            </span>
            <span class="text-zinc-400 font-mono text-[10px]">${calculateReadingTime(article.content)}</span>
        </div>

        <h3 onclick="navigateTo('article', '${article.slug}')" class="font-bold text-base text-zinc-900 dark:text-white leading-snug group-hover:text-dark:text-white  transition-colors font-sans">
            ${article.title}
        </h3>
    `;
    return card;
}

function renderHomepage() {
    let filtered = ARTICLES_DATA.filter(art => {
        const matchCat = state.selectedCategory === 'Semua' || art.category.toUpperCase() === state.selectedCategory.toUpperCase();
        const matchTag = !state.selectedTag || art.tags.includes(state.selectedTag);
        return matchCat && matchTag;
    });

    renderHeroSection();

    const grid = document.getElementById('articlesGrid');
    const emptyState = document.getElementById('emptyState');
    const countText = document.getElementById('articleCountText');

    grid.innerHTML = '';
    countText.textContent = `${filtered.length} ARTIKEL`;

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filtered.forEach(article => {
            grid.appendChild(createArticleCard(article));
        });
    }
}

function renderArticleDetail(article) {
    document.getElementById('detailCategory').textContent = article.category;
    document.getElementById('detailDate').textContent = formatDate(article.publishedAt);
    document.getElementById('detailReadingTime').textContent = calculateReadingTime(article.content);
    
    document.getElementById('detailTitle').textContent = article.title;
    document.getElementById('detailExcerpt').textContent = article.excerpt;
    
    document.getElementById('detailAuthorName').textContent = article.author.name;
    document.getElementById('detailAuthorAvatar').src = article.author.avatar;
    
    document.getElementById('detailImage').src = article.featuredImage;
    document.getElementById('detailCaption').textContent = `Dokumentasi visual untuk ${article.title}`;
    
    document.getElementById('detailBody').innerHTML = article.content;

    const tagsList = document.getElementById('detailTagsList');
    tagsList.innerHTML = '';
    article.tags.forEach(tag => {
        const badge = document.createElement('span');
        badge.className = "px-3 py-1 text-[11px] font-mono border border-zinc-300 dark:border-zinc-700 rounded-full uppercase cursor-pointer hover:bg-brand-coral hover:text-white hover:border-brand-coral transition-colors";
        badge.textContent = `#${tag}`;
        badge.onclick = () => filterByCategory(tag.toUpperCase());
        tagsList.appendChild(badge);
    });

    updateDetailBookmarkBtn();
    renderRelatedArticles(article);
}

function toggleAudioReader() {
    if (!('speechSynthesis' in window)) {
        showToast("Browser Anda tidak mendukung Web Speech API");
        return;
    }

    const playBtn = document.getElementById('audioPlayBtn');
    const icon = document.getElementById('audioIcon');
    const statusText = document.getElementById('audioStatusText');
    const wave = document.getElementById('audioWaveContainer');

    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        icon.className = "fa-solid fa-play text-xs ml-0.5";
        statusText.textContent = "Dengarkan Artikel";
        wave.classList.add('hidden');
        showToast("Audio dihentikan");
    } else {
        if (!state.currentArticle) return;

        const cleanText = state.currentArticle.title + ". " + state.currentArticle.content.replace(/<[^>]*>/g, '');
        currentUtterance = new SpeechSynthesisUtterance(cleanText);
        currentUtterance.lang = 'id-ID';
        currentUtterance.rate = 0.95;

        currentUtterance.onend = () => {
            isSpeaking = false;
            icon.className = "fa-solid fa-play text-xs ml-0.5";
            statusText.textContent = "Dengarkan Artikel";
            wave.classList.add('hidden');
        };

        window.speechSynthesis.speak(currentUtterance);
        isSpeaking = true;
        icon.className = "fa-solid fa-pause text-xs";
        statusText.textContent = "Memutar Audio...";
        wave.classList.remove('hidden');
        showToast("Memutar audio artikel");
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
    document.getElementById('themeIcon').className = isDark ? 'fa-solid fa-sun text-sm text-amber-400' : 'fa-solid fa-moon text-sm';
    showToast(isDark ? "MODE GELAP DIAKTIFKAN" : "MODE TERANG DIAKTIFKAN");
}

function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const msgEl = document.getElementById('toastMessage');

    msgEl.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
}

function navigateTo(viewName, articleSlug = null) {
    state.currentView = viewName;
    
    document.getElementById('viewHome').classList.add('hidden');
    document.getElementById('viewArticleDetail').classList.add('hidden');
    document.getElementById('viewBookmarks').classList.add('hidden');
    document.getElementById('readingProgressContainer').classList.add('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });

if (viewName === 'home') {
    // Riset filter kategori kembali ke kondisi awal (Semua)
    state.selectedCategory = 'Semua';
    state.selectedTag = null;

    document.getElementById('viewHome').classList.remove('hidden');
    renderHomepage();
}else if (viewName === 'article' && articleSlug) {
        const article = ARTICLES_DATA.find(a => a.slug === articleSlug);
        if (article) {
            state.currentArticle = article;
            renderArticleDetail(article);
            document.getElementById('viewArticleDetail').classList.remove('hidden');
            document.getElementById('readingProgressContainer').classList.remove('hidden');
        }
    } else if (viewName === 'bookmarks') {
        document.getElementById('viewBookmarks').classList.remove('hidden');
        renderBookmarksView();
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

function filterByCategory(category) {
    state.selectedCategory = category;
    state.selectedTag = null;
    
    document.querySelectorAll('.cat-pill').forEach(btn => {
        if (btn.dataset.cat === category) {
            btn.className = "cat-pill px-4 py-1.5 rounded-full text-white bg-brand-coral shadow-sm shadow-brand-coral/30 font-extrabold";
        } else {
            btn.className = "cat-pill px-4 py-1.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all font-semibold";
        }
    });

    const activeTagEl = document.getElementById('activeCategoryTag');
    if (activeTagEl) {
        activeTagEl.textContent = `[ SHOWING: ${category.toUpperCase()} ]`;
    }

    if (state.currentView !== 'home') {
        navigateTo('home');
    } else {
        renderHomepage();
    }
}

function resetFilters() {
    state.selectedCategory = 'Semua';
    state.selectedTag = null;
    state.searchQuery = '';
    filterByCategory('Semua');
}

function toggleArticleFont() {
    state.articleFontSerif = !state.articleFontSerif;
    const bodyEl = document.getElementById('detailBody');
    const fontNameEl = document.getElementById('fontTypeName');

    if (state.articleFontSerif) {
        bodyEl.className = "article-body font-serif text-zinc-800 dark:text-zinc-200 text-base sm:text-lg leading-relaxed pt-2";
        fontNameEl.textContent = "SERIF";
    } else {
        bodyEl.className = "article-body font-sans text-zinc-800 dark:text-zinc-200 text-sm sm:text-base leading-relaxed pt-2";
        fontNameEl.textContent = "SANS";
    }
}

function renderRelatedArticles(currentArt) {
    const container = document.getElementById('relatedArticlesGrid');
    container.innerHTML = '';

    const related = ARTICLES_DATA
        .filter(a => a.id !== currentArt.id)
        .slice(0, 3);

    related.forEach(art => {
        container.appendChild(createArticleCard(art));
    });
}

function toggleBookmark(articleId) {
    const article = ARTICLES_DATA.find(a => a.id === articleId);
    if (!article) return;

    const index = state.bookmarks.findIndex(b => b.id === articleId);
    if (index > -1) {
        state.bookmarks.splice(index, 1);
        showToast("ARTIKEL DIHAPUS DARI TERSIMPAN");
    } else {
        state.bookmarks.push(article);
        showToast("ARTIKEL DISIMPAN KE BOOKMARK");
    }

    localStorage.setItem('karsa_bookmarks', JSON.stringify(state.bookmarks));
    updateBookmarkBadge();
    
    if (state.currentView === 'home') renderHomepage();
    if (state.currentView === 'bookmarks') renderBookmarksView();
    if (state.currentView === 'article') updateDetailBookmarkBtn();
}

function toggleCurrentBookmark() {
    if (state.currentArticle) {
        toggleBookmark(state.currentArticle.id);
    }
}

function updateDetailBookmarkBtn() {
    if (!state.currentArticle) return;
    const btn = document.getElementById('detailBookmarkBtn');
    const isBookmarked = state.bookmarks.some(b => b.id === state.currentArticle.id);
    btn.innerHTML = `<i class="${isBookmarked ? 'fa-solid text-brand-coral' : 'fa-regular'} fa-bookmark text-sm"></i>`;
}

function updateBookmarkBadge() {
    const badge = document.getElementById('bookmarkBadge');
    const count = state.bookmarks.length;
    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function clearAllBookmarks() {
    state.bookmarks = [];
    localStorage.removeItem('karsa_bookmarks');
    updateBookmarkBadge();
    renderBookmarksView();
    showToast("DAFTAR BOOKMARK DIBERSIHKAN");
}

function renderBookmarksView() {
    const grid = document.getElementById('bookmarksGrid');
    const empty = document.getElementById('emptyBookmarks');

    grid.innerHTML = '';
    if (state.bookmarks.length === 0) {
        empty.classList.remove('hidden');
    } else {
        empty.classList.add('hidden');
        state.bookmarks.forEach(art => {
            grid.appendChild(createArticleCard(art));
        });
    }
}

function toggleSearchModal() {
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('searchInput');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        input.focus();
    }
}

function handleSearchInput() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');

    if (!query) {
        resultsContainer.innerHTML = `<p class="text-xs text-zinc-400 text-center py-6">Ketikkan kata kunci untuk mencari...</p>`;
        return;
    }

    const matches = ARTICLES_DATA.filter(a => {
        return a.title.toLowerCase().includes(query) || 
               a.excerpt.toLowerCase().includes(query) ||
               a.category.toLowerCase().includes(query);
    });

    resultsContainer.innerHTML = '';
    if (matches.length === 0) {
        resultsContainer.innerHTML = `<p class="text-xs text-zinc-400 text-center py-6">Tidak ada hasil untuk "${query}"</p>`;
        return;
    }

    matches.forEach(art => {
        const item = document.createElement('div');
        item.className = "p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 transition-colors rounded-lg";
        item.onclick = () => {
            toggleSearchModal();
            navigateTo('article', art.slug);
        };
        item.innerHTML = `
            <div class="space-y-0.5">
                <span class="text-[10px] font-bold text-brand-coral uppercase">${art.category}</span>
                <h4 class="text-xs font-bold text-zinc-900 dark:text-white">${art.title}</h4>
            </div>
            <i class="fa-solid fa-chevron-right text-xs text-zinc-400"></i>
        `;
        resultsContainer.appendChild(item);
    });
}

function shareArticle(type) {
    const url = window.location.href;
    const title = state.currentArticle ? state.currentArticle.title : "Karsa Kultura";

    if (type === 'copy') {
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast("TAUTAN DISALIN KE CLIPBOARD");
    } else if (type === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (type === 'whatsapp') {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + url)}`, '_blank');
    }
}

function setupScrollListener() {
    window.addEventListener('scroll', () => {
        if (state.currentView !== 'article') return;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('readingProgressBar').style.width = scrolled + '%';
    });
}

function toggleJsonModal() {
    document.getElementById('jsonModal').classList.toggle('hidden');
}

function generateJsonSchema() {
    const title = document.getElementById('jsonFormTitle').value || "Judul Berita";
    const category = document.getElementById('jsonFormCategory').value;
    const author = document.getElementById('jsonFormAuthor').value || "Redaksi Karsa Kultura";
    const tagsInput = document.getElementById('jsonFormTags').value || "Musik, Seni";
    const excerpt = document.getElementById('jsonFormExcerpt').value || "Ringkasan berita...";
    const content = document.getElementById('jsonFormContent').value || "<p>Isi berita...</p>";

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const newObj = {
        id: `art-${Date.now().toString().slice(-3)}`,
        title: title,
        slug: slug,
        excerpt: excerpt,
        content: content,
        featuredImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
        category: category,
        tags: tags,
        author: { name: author, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
        publishedAt: new Date().toISOString().split('T')[0],
        isFeatured: false
    };

    document.getElementById('jsonOutput').textContent = JSON.stringify(newObj, null, 2);
    document.getElementById('jsonOutputContainer').classList.remove('hidden');
}

function copyGeneratedJson() {
    const jsonText = document.getElementById('jsonOutput').textContent;
    const tempInput = document.createElement('textarea');
    tempInput.value = jsonText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast("OBJEK JSON DISALIN!");
}

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.getElementById('themeIcon').className = 'fa-solid fa-sun text-sm text-amber-400';
    } else {
        document.documentElement.classList.remove('dark');
        document.getElementById('themeIcon').className = 'fa-solid fa-moon text-sm';
    }

    updateBookmarkBadge();
    setupScrollListener();
    loadArticlesData();
});