document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const Name = params.get("data");

    if (!Name) {
        document.body.innerHTML = "<h1>لم يتم تحديد المطلوب</h1>";
        return;
    }

    fetch("/images pharaohs/kings_ar.json")
        .then(response => {
            if (!response.ok) throw new Error("فشل تحميل ملف JSON");
            return response.json();
        })
        .then(data => {
            const Data = data.find(item => item.name.trim() === Name.trim());

            if (!Data) {
                document.body.innerHTML = `<h1> غير موجود</h1>`;
                return;
            }

            const imagePath = `/images pharaohs/${Data.name}.jpg`;

            document.body.innerHTML = `
                <a href="#" class="logo">Anubis</a>
                <a href="/index.html" class="nav">الرئيسية</a>
                <h1>${Data.name}</h1>
                <div class="content-container">
                    <div class="image-container">
                        <img src="${imagePath}" alt="${Data.name || 'صورة غير متوفرة'}">
                    </div>
                    <div class="text-container">
                        <div class="section-title" onclick="showContent('intro')">مقدمة</div>
                        <div class="section-title" onclick="showContent('achievements')">الإنجازات</div>
                        <div class="section-title" onclick="showContent('rule')">قاعدة</div>
                        <div class="section-title" onclick="showContent('religion')">الدين</div>
                        <div class="section-title" onclick="showContent('born')">وُلِدّ</div>
                        <div class="section-title" onclick="showContent('died')">مات</div>
                        <div class="section-title" onclick="showContent('children')">أولاد</div>
                        <div class="section-title" onclick="showContent('marriage')">زواج</div>
                        <div class="section-title" onclick="showContent('wars')">حروب</div>
                        <div class="section-title" onclick="showContent('museums')">المتاحف</div>
                        <div class="section-title" onclick="showContent('countryRelation')">العلاقات</div>
                        <div class="section-title" onclick="showContent('culturalEvents')">الأحداث الثقافية</div>
                        <div class="section-title" onclick="showContent('scientificEvents')">الأحداث العلمية</div>
                        <div class="section-title" onclick="showContent('economicRelations')">العلاقات الاقتصادية</div>
                        <div class="section-title" onclick="showContent('constructionProjects')">مشاريع البناء</div>
                        <div class="section-title" onclick="showContent('generations')">أجيال</div>
                        <div class="section-title" onclick="showContent('famous')">مشاهير</div>

                        <div id="mainDisplay" class="section-content"></div>
                    </div>
                </div>
            `;

            // تعريف دالة العرض داخل الصفحة
            window.showContent = function (key) {
                const contentMap = {
                    intro: Data.intro,
                    achievements: Data.achievements,
                    rule: Data.rule,
                    religion: Data.religion,
                    born: Data.born,
                    died: Data.died,
                    children: Data.children,
                    marriage: Data.marriage,
                    wars: Data.wars,
                    museums: Data.museums,
                    countryRelation: Data.countryRelation,
                    culturalEvents: Data.culturalEvents,
                    scientificEvents: Data.scientificEvents,
                    economicRelations: Data.economicRelations,
                    constructionProjects: Data.constructionProjects,
                    generations: Data.generations,
                    famous: Data.famous
                };

                const displayBox = document.getElementById('mainDisplay');
                displayBox.innerHTML = `<p>${contentMap[key] || "لا يوجد محتوى"}</p>`;
            };
        })
        .catch(error => {
            console.error("خطأ في تحميل البيانات:", error);
            document.body.innerHTML = `<h1>حدث خطأ أثناء تحميل البيانات</h1>`;
        });
});
