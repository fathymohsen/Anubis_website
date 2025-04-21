document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const Name = params.get("data");
    if (!Name) {
        document.body.innerHTML = "<h1>لم يتم تحديد المطلوب</h1>";
        return;
    }
    fetch("./myth_ar.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("فشل تحميل ملف JSON");
            }
            return response.json();
        })
        .then(data => {
            const Data = data.find(data => data.name.trim() === Name.trim());

            if (!Data) {
                document.body.innerHTML = `<h1> غير موجود</h1>`;
                return;
            }
            const imagePath = `./${Data.name}.jpeg`; 
            document.body.innerHTML = `
                <a href="#" class="logo">Anubis</a>
                <a href="/index.html" class="nav">الرئيسية</a>
                <h1>${Data.name}</h1>
                <div class="content-container">
                    <div class="image-container">
                        <img src="${imagePath}" alt="${Data.name || 'صورة غير متوفرة'}">
                    </div>
                    <div class="text-container">
                        <div class="section-title" onclick="toggleContent('title')">العنوان</div>
                        <div id="title" class="section-content"><p>${Data.title}</p></div>

                        <div class="section-title" onclick="toggleContent('description')">الوصف</div>
                        <div id="description" class="section-content"><p>${Data.description}</p></div>
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
    content.style.display = content.style.display === "none" || content.style.display === "" ? "block" : "none";
}