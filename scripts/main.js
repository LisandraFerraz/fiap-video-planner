// Guarda todos os seletores que sao usados globalmente

// Seletores de textos
var calendarDesc = document.querySelector("#calendar_desc");
var calendarTitle = document.querySelector("#calendar_title");
var preventSearchMsg = document.querySelector(".prevent_search_msg");
var selectedDesc = document.querySelector("#selected_day_desc");

// Seletores de grupos
var notificationMsg = document.querySelector("#notification");
var componentBody = document.querySelector("body");
var videosGroupDiv = document.querySelector("#videos_group");
var videoSearchGroup = document.querySelector("#video_search_group");
var selectedDayVG = document.querySelector("#selected_day_videos_group");
var daysGroupDiv = document.querySelector("#days_group");
var calendar = document.querySelector(".calendar");

var searchBar = document.querySelector(".search_bar");

// Seletores de botoes
var submitBtn = document.querySelector("#submit-btn");
var backBtn = document.querySelector(".back_btn");
var collapseBtn = document.querySelector("#collapser");

let keyword = "";
const YT_BASE_URL = "https://www.googleapis.com/youtube/v3";
const maxResults = 50;

let isLoading = false;
let days = [];
let videosDetails = [];

// let videosDetails = [
//   {
//     id: "QqkLnNClpAQ",
//     publishedAt: "2025-04-03T09:00:35Z",
//     title: "KAI 카이 &#39;Adult Swim&#39; MV",
//     thumbnail: "https://i.ytimg.com/vi/QqkLnNClpAQ/hqdefault.jpg",
//     channelTitle: "SMTOWN",
//     videoLength: "02:35",
//   },
//   {
//     id: "_I4CoRahpSo",
//     publishedAt: "2025-04-03T12:19:34Z",
//     title: "&#39;단독 공개&#39; KAI (카이) - Adu...",
//     thumbnail: "https://i.ytimg.com/vi/_I4CoRahpSo/hqdefault.jpg",
//     channelTitle: "Mnet K-POP",
//     videoLength: "02:48",
//   },
//   {
//     id: "kuOmrRlJDp0",
//     publishedAt: "2025-04-05T07:20:12Z",
//     title: "🙌👏🙌👏 #KAI #카이 #EXO #엑소 #we...",
//     thumbnail: "https://i.ytimg.com/vi/kuOmrRlJDp0/hqdefault.jpg",
//     channelTitle: "EXO",
//     videoLength: "00:20",
//   },
//   {
//     id: "oDvpdtxYMPE",
//     publishedAt: "2023-03-29T09:30:12Z",
//     title: "EXO KAI&#39;s amazing spin per...",
//     thumbnail: "https://i.ytimg.com/vi/oDvpdtxYMPE/hqdefault.jpg",
//     channelTitle: "K-contents Voyage",
//     videoLength: "00:15",
//   },
//   {
//     id: "zWd_AP_58fI",
//     publishedAt: "2021-12-05T12:14:29Z",
//     title: "KAI(카이) - Peaches @인기가요 inkiga...",
//     thumbnail: "https://i.ytimg.com/vi/zWd_AP_58fI/hqdefault.jpg",
//     channelTitle: "SBSKPOP X INKIGAYO",
//     videoLength: "03:48",
//   },
//   {
//     id: "6BhCTJXMdy8",
//     publishedAt: "2023-03-18T12:30:28Z",
//     title: "Dancing king &amp; queen Rover...",
//     thumbnail: "https://i.ytimg.com/vi/6BhCTJXMdy8/hqdefault.jpg",
//     channelTitle: "EXO",
//     videoLength: "00:31",
//   },
//   {
//     id: "yb4uNVbT4KY",
//     publishedAt: "2013-09-28T19:49:35Z",
//     title: "[댄싱9/Dancing9] Girls&#39; Gene...",
//     thumbnail: "https://i.ytimg.com/vi/yb4uNVbT4KY/hqdefault.jpg",
//     channelTitle: "Mnet K-POP",
//     videoLength: "02:03",
//   },
//   {
//     id: "kUr8X5iZUGU",
//     publishedAt: "2021-12-04T14:00:16Z",
//     title: "[BE ORIGINAL] KAI(카이) &#39;Pea...",
//     thumbnail: "https://i.ytimg.com/vi/kUr8X5iZUGU/hqdefault.jpg",
//     channelTitle: "STUDIO CHOOM [스튜디오 춤]",
//     videoLength: "03:27",
//   },
//   {
//     id: "QC7JTQae530",
//     publishedAt: "2025-04-12T13:00:44Z",
//     title: "Justin Bieber VS Kai (EXO) Tra...",
//     thumbnail: "https://i.ytimg.com/vi/QC7JTQae530/hqdefault.jpg",
//     channelTitle: "Celebrity Evolutions",
//     videoLength: "08:07",
//   },
//   {
//     id: "X6zB0hPa154",
//     publishedAt: "2023-01-01T16:32:09Z",
//     title: "EXO 엑소 &#39;LOVE SHOT&#39; Sta...",
//     thumbnail: "https://i.ytimg.com/vi/X6zB0hPa154/hqdefault.jpg",
//     channelTitle: "다다익첸",
//     videoLength: "03:24",
//   },
//   {
//     id: "Qgqk96TJZyI",
//     publishedAt: "2023-03-15T14:00:14Z",
//     title: "[BE ORIGINAL] KAI(카이) &#39;Rov...",
//     thumbnail: "https://i.ytimg.com/vi/Qgqk96TJZyI/hqdefault.jpg",
//     channelTitle: "STUDIO CHOOM [스튜디오 춤]",
//     videoLength: "03:04",
//   },
//   {
//     id: "s_V_ewm__P0",
//     publishedAt: "2022-06-05T08:10:51Z",
//     title: "damnnn!🔥👁️👄👁️🤰 #kai #exo ...",
//     thumbnail: "https://i.ytimg.com/vi/s_V_ewm__P0/hqdefault.jpg",
//     channelTitle: "𝙼𝚒𝚗'𝚜 𝙼𝚊𝚗𝚍𝚎𝚛𝚒𝚗",
//     videoLength: "00:15",
//   },
//   {
//     id: "Nn-wZ1MHxwQ",
//     publishedAt: "2019-06-10T10:51:48Z",
//     title: "♨핫클립♨[HD][카이 리액션] 스웩 넘치는 카이(EX...",
//     thumbnail: "https://i.ytimg.com/vi/Nn-wZ1MHxwQ/hqdefault.jpg",
//     channelTitle: "JTBC Voyage",
//     videoLength: "13:07",
//   },
//   {
//     id: "zlTIextYnyQ",
//     publishedAt: "2023-03-13T08:59:10Z",
//     title: "KAI 카이 &#39;Rover&#39; MV",
//     thumbnail: "https://i.ytimg.com/vi/zlTIextYnyQ/hqdefault.jpg",
//     channelTitle: "SMTOWN",
//     videoLength: "03:03",
//   },
//   {
//     id: "lOX73kBRyWs",
//     publishedAt: "2022-12-26T09:00:20Z",
//     title: "KAI, SEULGI, JENO, KARINA &#39...",
//     thumbnail: "https://i.ytimg.com/vi/lOX73kBRyWs/hqdefault.jpg",
//     channelTitle: "SMTOWN",
//     videoLength: "03:35",
//   },
//   {
//     id: "8fcOLBawlkU",
//     publishedAt: "2022-11-15T01:26:38Z",
//     title: "Mmmh - KAI カイ(EXO エクソ) [STAGE ...",
//     thumbnail: "https://i.ytimg.com/vi/8fcOLBawlkU/hqdefault.jpg",
//     channelTitle: "KBS WORLD TV",
//     videoLength: "03:18",
//   },
//   {
//     id: "lz2opWX2dw0",
//     publishedAt: "2025-04-08T07:22:39Z",
//     title: "How hard is KAI 카이 - ‘Adult Sw...",
//     thumbnail: "https://i.ytimg.com/vi/lz2opWX2dw0/hqdefault.jpg",
//     channelTitle: "Kathleen Carm",
//     videoLength: "00:28",
//   },
//   {
//     id: "wbMrPXF8P3M",
//     publishedAt: "2023-04-18T04:43:12Z",
//     title: "These idols reaction really wa...",
//     thumbnail: "https://i.ytimg.com/vi/wbMrPXF8P3M/hqdefault.jpg",
//     channelTitle: "Kpoplands567",
//     videoLength: "00:20",
//   },
//   {
//     id: "vN_TuxkMjIE",
//     publishedAt: "2020-12-04T09:22:17Z",
//     title: "KAI - Mmmh(음) (Music Bank) |...",
//     thumbnail: "https://i.ytimg.com/vi/vN_TuxkMjIE/hqdefault.jpg",
//     channelTitle: "KBS WORLD TV",
//     videoLength: "03:24",
//   },
// ];

// Recebe o resultado dos fetches videos e detalhes
// cria um objeto com os todos os atributos necessários de ambos resultados

async function organizeVideoDetails() {
  const videosList = await fetchSearchTerm(); //detalhes de videosList
  const videosFiltered = await fetchVideosDetails(); //detalhes de videosList

  if (videosList && videosList.length > 1) {
    videosList.map((video) => {
      videosFiltered.filter((item) => {
        if (video.id.videoId === item.id) {
          videosDetails.push({
            id: video.id.videoId,
            publishedAt: video.snippet.publishedAt,
            title: shortenTitle(video.snippet.title),
            thumbnail: video.snippet.thumbnails.high.url,
            channelTitle: video.snippet.channelTitle,
            videoLength: formatTime(item.contentDetails.duration),
          });
        }
      });
    });
    addVideosToDays();
  }
  renderVideosThumb(videosGroupDiv, videosDetails);
  // collapseCalendar();
}

// === FORMATAÇÕES ===

// transforma minutos/horas em segundos ou retorna somente segundos
function calcWatchTime(videoLength = "") {
  const parts = videoLength.split(":").map(Number);

  if (parts.length === 3) {
    // hh:mm:ss
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
  } else if (parts.length === 2) {
    // mm:ss
    const [m, s] = parts;
    return m * 60 + s;
  } else {
    return 0;
  }
}

function translateDayPTBR(day = "") {
  switch (day.toLowerCase()) {
    case "sunday":
      return "Domingo";
    case "monday":
      return "Segunda-Feira";
    case "tuesday":
      return "Terça-Feira";
    case "wednesday":
      return "Quarta-Feira";
    case "thursday":
      return "Quinta-Feira";
    case "friday":
      return "Sexta-Feira";
    case "saturday":
      return "Sábado";

    default:
      return "Não definido";
  }
}

function formatTime(time) {
  const match = time.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  const hours = match[1] ? match[1].padStart(2, "0") : "00";
  const minutes = match[2] ? match[2].padStart(2, "0") : "00";
  const seconds = match[3] ? match[3].padStart(2, "0") : "00";

  if (hours !== "00") {
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
}

function shortenTitle(title) {
  return title.length > 30 ? title.slice(0, 30) + "..." : title;
}

// === ATUALIZAÇÕES DOS COMPONENTES ===

// Primeira a ser executada. Cria próximos 7 dias, contando com o atual
function getNextDays() {
  videoSearchGroup.classList.add("hidden");

  for (let i = 0; i <= 6; i++) {
    days.push({
      id: i + 1,
      date: moment().add(i, "days").format("DD"),
      weekDay: moment().add(i, "days").format("dddd"),
      availMinutes: 0,
      vidQty: 0,
      videosList: [],
    });
  }

  renderDays();
}

// Atualiza os cards de 7 dias
function renderDays() {
  const daysWeek = [...days];
  daysGroupDiv.innerHTML = "";

  daysWeek.forEach((day) => {
    daysGroupDiv.innerHTML += `
    <div class="day_box" id="${day.id}">
      <div class="calendar_header"> 
        <div>
          <span class="day_week">
          ${
            day.id == 1
              ? "Hoje (" + translateDayPTBR(day.weekDay) + ")"
              : translateDayPTBR(day.weekDay)
          }</span>
          <i class="fa fa-arrow-right"></i>
        </div>
        <div>
          <span class="day_number">${day.date}</span>
        </div>
    </div>
    
      <div class="avail_container">
       <div>
         <input class="avail_minutes" type="number" value="${
           day.availMinutes
         }" />
        <span> minutos disponíveis.</span>
       </div>
        <section class="day_vids_list">
          ${day.videosList.map(
            (video) =>
              `
              <h4>${video.videoLength}</h4>
              <span>${video.title}</span>
              `
          )}
        </section>
      </div>
    </div>
`;
  });
}

// Atualiza grids de videos
function renderVideosThumb(HTMLVidGroup, videosDetails = []) {
  if (videosDetails && videosDetails.length > 0) {
    HTMLVidGroup.innerHTML = "";
    videosDetails.forEach((video) => {
      HTMLVidGroup.innerHTML += `
      <div class="video_template">
          <h4>${video.title}</h4>
          <div class="video_thumbnail">
            <img
              src="${video.thumbnail}"
              alt="${video.title}"
            />
          <span class="video_duration">${video.videoLength}</span>
          </div>
        </div>
      `;
    });
  }
}

// Atualiza o objeto days conforme seus atributos mudam
function updateDaysProps(event, key, value) {
  const targetDay = event.target.closest(".day_box");
  const dayId = targetDay.id;

  if (dayId && value !== null) {
    const daysUpdated = days.map((day) => {
      return {
        ...day,
        [key]: day.id === Number(dayId) ? value : day[key],
      };
    });

    days = daysUpdated;
  }
}

// Adiciona os videos do organizeVideoDetails() nos dias do getNextDays()

function addVideosToDays() {
  const daysWithVideos = [...days];
  let videoIndex = 0;

  for (let i = 0; i < daysWithVideos.length; i++) {
    let availTime = daysWithVideos[i].availMinutes * 60;

    while (videoIndex < videosDetails.length) {
      let videoFits = false;

      for (let v = videoIndex; v < videosDetails.length; v++) {
        const video = videosDetails[v];
        const videoTime = calcWatchTime(video.videoLength);

        if (videoTime <= availTime) {
          daysWithVideos[i].videosList.push(video);
          daysWithVideos[i].vidQty = daysWithVideos[i].videosList.length;
          availTime -= videoTime;

          videosDetails.splice(v, 1);
          videoFits = true;
          break;
        }
      }

      if (!videoFits) {
        break;
      }
    }
  }

  days = daysWithVideos;
  renderDays();
}

// Collapser do calendário
function collapseCalendar() {
  if (calendar.classList.contains("collapsed")) {
    calendar.style.height = calendar.scrollHeight + "px";
    calendar.classList.remove("collapsed");
  } else {
    calendar.classList.add("collapsed");
    calendar.style.height = calendar.scrollHeight + "px";

    //aguarda o height
    requestAnimationFrame(() => {
      calendar.style.height = "0px";
    });
  }
}

// === EVENTOS DE INPUT ===

searchBar.addEventListener("change", (event) => {
  keyword = event.target.value;
});

// Pesquisar palavra-chave
submitBtn.addEventListener("click", () => {
  // renderVideosThumb(videosGroupDiv, videosDetails);
  // addVideosToDays();

  if (keyword !== "") {
    organizeVideoDetails();
  } else {
    createNotification("Preencha o campo de pesquisa.");
  }
});

// Altera o conteudo da div "calendar" para o dia selecionado e template geral
daysGroupDiv.addEventListener("click", (event) => {
  calendar.style.height = "auto";
  const daySelected = event.target.closest(".fa-arrow-right");
  const targetDay = event.target.closest(".day_box");

  if (targetDay) {
    const dayId = targetDay.id;
    const dayFocus = days.find((day) => day.id === Number(dayId));

    if (daySelected && dayFocus.videosList?.length > 0) {
      let day = daySelected.closest(".day_box");

      selectedDesc.classList.remove("hidden");
      selectedDayVG.classList.remove("hidden");

      targetDay.classList.add("hidden");
      videoSearchGroup.classList.add("hidden");
      calendarDesc.classList.add("hidden");
      day.querySelector(".fa-arrow-right").classList.add("hidden");
      backBtn.classList.remove("hidden");

      selectedDesc.textContent =
        "Confira a seleção de vídeos escolhidos com base nos resultados da pesquisa e sua disponibilidade para esse dia.";
      calendarTitle.textContent = `${dayFocus.date}, ${translateDayPTBR(
        dayFocus.weekDay
      )} `;

      daysGroupDiv.replaceChildren(day);
      renderVideosThumb(selectedDayVG, dayFocus.videosList);
    }
  }
});

// Altera o conteudo da div "calendar" para todos os dias e template original
backBtn.addEventListener("click", () => {
  videoSearchGroup.classList.remove("hidden");
  calendarDesc.classList.remove("hidden");

  selectedDesc.classList.add("hidden");
  backBtn.classList.add("hidden");
  selectedDayVG.classList.add("hidden");

  calendarTitle.textContent = "Seu calendário de vídeos";

  renderVideosThumb(videosGroupDiv, videosDetails);
  renderDays();
});

// capturar valor dos inputs
daysGroupDiv.addEventListener("change", (event) => {
  const targetInput = event.target.closest(".avail_minutes");

  updateDaysProps(event, "availMinutes", Number(targetInput.value));

  const allUnavailable = days.every((day) => Number(day.availMinutes) === 0);
  if (!allUnavailable) {
    preventSearchMsg.classList.add("hidden");
    videoSearchGroup.classList.remove("hidden");
  } else {
    preventSearchMsg.classList.remove("hidden");
    videoSearchGroup.classList.add("hidden");
  }
});

// Fecha notificação ao clicar nela
notificationMsg.addEventListener("click", () => {
  setNotifDisplay("", "shown", "hidden");
});

collapseBtn.addEventListener("click", () => {
  collapseCalendar();
});

// INICIO FUNÇÕES
getNextDays();
