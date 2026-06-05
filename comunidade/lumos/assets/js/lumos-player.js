/* =========================================================
ATÍPICOS — ALBUM EXPERIENCE
========================================================= */

const items = document.querySelectorAll(".story-item");

const audio = document.getElementById("audioControl");

const title = document.getElementById("playerTitle");

const icon = document.getElementById("playerIcon");

const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");

let playlist = [];

let currentIndex = -1;

/* =========================================================
BUILD PLAYLIST
========================================================= */

items.forEach((item,index)=>{

    playlist.push(item);

    let progress = document.createElement("div");

    progress.className = "card-progress";

    item.appendChild(progress);

    const playBtn = item.querySelector(".play-btn");

    playBtn.addEventListener("click",(e)=>{

        e.stopPropagation();

        currentIndex = index;

        playStory(item);

    });

});

/* =========================================================
PLAY STORY
========================================================= */

function playStory(item){

    const src = item.getAttribute("data-audio");

    const storyTitle =
    item.querySelector(".story-title").innerText;

    const iconSymbol =
    item.querySelector(".story-icon").innerHTML;

    audio.src = src;

    audio.load();

    title.textContent = storyTitle;

    icon.innerHTML = iconSymbol;

    audio.play().catch(err=>{
        console.log(err);
    });

    items.forEach(el=>
        el.classList.remove("playing")
    );

    item.classList.add("playing");

}

/* =========================================================
NEXT
========================================================= */

nextBtn.onclick = ()=>{

    if(currentIndex < playlist.length - 1){

        currentIndex++;

        playStory(playlist[currentIndex]);

    }

}

/* =========================================================
PREV
========================================================= */

prevBtn.onclick = ()=>{

    if(currentIndex > 0){

        currentIndex--;

        playStory(playlist[currentIndex]);

    }

}

/* =========================================================
AUTO NEXT
========================================================= */

audio.addEventListener("ended",()=>{

    if(currentIndex < playlist.length - 1){

        currentIndex++;

        playStory(playlist[currentIndex]);

    }

});

/* =========================================================
PROGRESS BAR
========================================================= */

audio.addEventListener("timeupdate",()=>{

    if(currentIndex === -1 || !audio.duration)
    return;

    const progress =
    (audio.currentTime / audio.duration) * 100;

    const bar =
    playlist[currentIndex]
    .querySelector(".card-progress");

    if(bar){

        bar.style.width = progress + "%";

    }

});

/* =========================================================
FILTERS
========================================================= */

const filters =
document.querySelectorAll(".filter-btn");

filters.forEach(btn=>{

    btn.onclick = ()=>{

        filters.forEach(b=>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        const filter = btn.dataset.filter;

        items.forEach(item=>{

            if(filter === "all"){

                item.style.display = "flex";

            }

            else if(item.classList.contains(filter)){

                item.style.display = "flex";

            }

            else{

                item.style.display = "none";

            }

        });

    };

});

/* =========================================================
HEADER SCROLL EFFECT
========================================================= */

const header =
document.getElementById("header");

window.addEventListener("scroll",()=>{

    if(window.scrollY > 40){

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

/* =========================================================
REVEAL ANIMATION
========================================================= */

const revealElements =
document.querySelectorAll(
".section, .card, .quote"
);

const revealObserver =
new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("revealed");

        }

    });

},{
    threshold:0.1
});

revealElements.forEach(el=>{

    revealObserver.observe(el);

});

/* =========================================================
PARALLAX GLOW
========================================================= */

const heroGlow =
document.querySelector(".hero-glow");

window.addEventListener("mousemove",(e)=>{

    if(!heroGlow) return;

    const x =
    (e.clientX / window.innerWidth - 0.5) * 40;

    const y =
    (e.clientY / window.innerHeight - 0.5) * 40;

    heroGlow.style.transform =
    `translate(${x}px, ${y}px)`;

});
