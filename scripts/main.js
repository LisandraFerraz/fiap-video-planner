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
const maxResults = 20;

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
  // collapseCalendar();
}

// === FORMATAÇÕES ===

// transforma minutos/horas em segundos ou retorna somente segundos
function calcWatchTime(videoLength = "") {
  const timeSplit = videoLength.split(":").map(Number);

  if (timeSplit.length === 3) {
    // hh:mm:ss
    const [h, m, s] = timeSplit;
    return h * 3600 + m * 60 + s;
  } else if (timeSplit.length === 2) {
    // mm:ss
    const [m, s] = timeSplit;
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

    const videoTime = calcWatchTime(videosDetails[videoIndex]?.videoLength);

    if (videoTime < availTime) {
      videoIndex++;

      daysWithVideos[i].videosList.push(videosDetails[videoIndex]);
      daysWithVideos[i].vidQty = daysWithVideos[i].videosList?.length;

      availTime -= videoTime;
    }
  }

  renderDays();
  console.log("Resultado atribuição | ", daysWithVideos);
  console.log("videosDetails | ", videosDetails);
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
