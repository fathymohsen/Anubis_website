document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const Name = params.get("data");

    if (!Name) {
        document.body.innerHTML = "<h1>لم يتم تحديد المطلوب</h1>";
        return;
    }

    fetch("/project/GOLDEN_ar.json")
        .then(response => response.ok ? response.json() : Promise.reject("فشل تحميل ملف JSON"))
        .then(data => {
            const Data = data.find(item => item.name.trim() === Name.trim());

            if (!Data) {
                document.body.innerHTML = `<h1> غير موجود</h1>`;
                return;
            }

            const imagePath = `/images/${Data.name}.jpg`; 

            document.body.innerHTML = `
                <header>
                    <a href="#" class="logo">Anubis</a>
                    <a href="/index.html" class="nav">الرئيسية</a>
                </header>

                <div class="container">
                    <div class="image-container">
                        <img src="${imagePath}" alt="${Data.name || 'صورة غير متوفرة'}">
                    </div>
                    <div class="main-title">
                        <h1>${Data.name}</h1>
                    </div>
                    <div class="text-container">
                        <div class="section" onclick="toggleContent('governorate')">
                             <strong>المحافظة</strong>
                        </div>
                        <div id="governorate" class="section-content">${Data.governorate}</div>

                        <div class="section" onclick="toggleContent('subtitle')">
                             <strong>العنوان الفرعي</strong>
                        </div>
                        <div id="subtitle" class="section-content">${Data.subtitle}</div>

                        <div class="section" onclick="toggleContent('description')">
                             <strong>الوصف</strong>
                        </div>
                        <div id="description" class="section-content">${Data.description}</div>

                        <div class="section" onclick="openMap('${Data.location}')">
                             <strong>الموقع على الخريطة</strong>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error("خطأ في تحميل البيانات:", error);
            document.body.innerHTML = `<h1>حدث خطأ أثناء تحميل بيانات </h1>`;
        });
});

function toggleContent(id) {
    const content = document.getElementById(id);
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        document.querySelectorAll('.section-content').forEach(el => el.style.display = "none");
        content.style.display = "block";
    }
}

// دالة لفتح الرابط في نافذة جديدة
function openMap(mapLink) {
    window.open(mapLink, "_blank");
}
