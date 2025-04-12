// Guarda todos os seletores que sao usados globalmente

var notificationMsg = document.querySelector("#notification");
var componentBody = document.querySelector("body");
var videosGroupDiv = document.querySelector("#videos_group");
var selectedDayVG = document.querySelector("#selected_day_videos_group");
var videoSearchGroup = document.querySelector("#video_search_group");
var daysGroupDiv = document.querySelector("#days_group");
var submitBtn = document.querySelector("#submit-btn");
var calendar = document.querySelector(".calendar");
var calendarDesc = document.querySelector("#calendar_desc");
var backBtn = document.querySelector(".back_btn");
var calendarTitle = document.querySelector("#calendar_title");

const keyword = "exo stages";
const YT_BASE_URL = "https://www.googleapis.com/youtube/v3";
var maxResults = 5;

let isLoading = false;
let days = [];
let videosDetails = [];

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
}

// === FORMATAÇÕES ===

// recebe videoLength de videosDetails e availMinutes de days
// e verifica se videoLength <= availMinutes
function calcWatchTime(videoLength = "") {
  // minutos
  if (
    videoLength.charAt(0) !== 0 &&
    videoLength.charAt(1) !== 0 &&
    videoLength.length === 5
  ) {
    const minToSecs = Number(videoLength.slice(0, 2)) * 60;
    const secondsVideo = minToSecs + Number(videoLength.slice(3, 5));
    return secondsVideo;
  }
  // horas
  else if (videoLength.length === 8) {
    const hoursToSecs = Number(videoLength.slice(0, 2)) * 3600;
    const minsToSecs = Number(videoLength.slice(3, 5)) * 60;
    const secondsVideo =
      hoursToSecs + minsToSecs + Number(videoLength.slice(6, 8));
    return secondsVideo;
  }
  //segundos
  else {
    return Number(videoLength.slice(3, 5));
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
    <div>
      <span class="day_week">${
        day.id == 1
          ? "Hoje (" + translateDayPTBR(day.weekDay) + ")"
          : translateDayPTBR(day.weekDay)
      }</span>
    </div>
    <div>
      <span class="day_video">${
        day.vidQty == 1 ? day.vidQty + " vídeo" : day.vidQty + " videos"
      }</span>
    </div>
    <div class="avail_container">
      <input class="avail_minutes" type="number" value="${day.availMinutes}" />
      <span> minutos</span>
    </div>
    <div>
      <span class="day_number">${day.date}</span>
      <i class="fa fa-arrow-right"></i>
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

  if (dayId && value) {
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
  const daysWithVideos = days;
  let videoIndex = 0;

  for (let i = 0; i < daysWithVideos.length; i++) {
    let availTime = daysWithVideos[i].availMinutes * 60;
    let videoTime = calcWatchTime(videosDetails[videoIndex]?.videoLength);

    while (videoIndex < videosDetails?.length && videoTime < availTime) {
      daysWithVideos[i].videosList.push(videosDetails[videoIndex]);
      daysWithVideos[i].vidQty = daysWithVideos[i].videosList?.length;

      availTime -= videoTime;
      videoIndex++;
    }
  }
  renderDays();
}

// === EVENTOS DE BOTÕES ===

// Pesquisar palavra-chave
submitBtn.addEventListener("click", () => {
  if (keyword !== "") {
    organizeVideoDetails();
  } else {
    console.error("erro");
  }
});

// Altera o conteudo da div "calendar" para o dia selecionado e template geral
daysGroupDiv.addEventListener("click", (event) => {
  const daySelected = event.target.closest(".fa-arrow-right");
  const targetDay = event.target.closest(".day_box");
  const dayId = targetDay.id;

  if (daySelected) {
    let day = daySelected.closest(".day_box");

    selectedDayVG.classList.remove("hidden");
    videoSearchGroup.classList.add("hidden");
    day.querySelector(".fa-arrow-right").classList.add("hidden");
    calendarDesc.classList.add("hidden");
    backBtn.classList.remove("hidden");

    calendarTitle.textContent = "Conteúdo selecionado";
    daysGroupDiv.replaceChildren(day);

    const targetDay = days.find((day) => day.id === Number(dayId));
    renderVideosThumb(selectedDayVG, targetDay.videosList);
  }
});

// Altera o conteudo da div "calendar" para todos os dias e template original
backBtn.addEventListener("click", () => {
  videoSearchGroup.classList.remove("hidden");
  calendarDesc.classList.remove("hidden");
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
});

// Fecha notificação ao clicar nela
notificationMsg.addEventListener("click", () => {
  setNotifDisplay("", "shown", "hidden");
});

// INICIO FUNÇÕES
getNextDays();
