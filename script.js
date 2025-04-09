var videosGroupDiv = document.querySelector("#videos_group");
var submitBtn = document.querySelector("#submit-btn");

var keyword = "exo stages";

var YT_API_KEY = "AIzaSyCN9hV48A_9ezBE8_PUs3io-GDiIWGlJLQ";
var YT_BASE_URL = "https://www.googleapis.com/youtube/v3";
var maxResults = 5;

var isLoading = false;

// == FETCHES ==
async function fetchSearchTerm() {
  try {
    const result = await fetch(
      `${YT_BASE_URL}/search?q=${keyword}&part=snippet&type=video&maxResults=${maxResults}&key=${YT_API_KEY}`
    );
    const formarttedData = await result.json();

    return formarttedData["items"];
  } catch (error) {
    console.error("Erro: ", error);
  }
}

async function fetchVideosDetails() {
  let vidList = [];
  try {
    vidList = await fetchSearchTerm();
    if (vidList && vidList.length > 1) {
      const videoIds = await vidList.map((item) => item["id"].videoId);
      const idsParam = videoIds.join(",");

      const result = await fetch(
        `${YT_BASE_URL}/videos?part=contentDetails&id=${idsParam}&key=${YT_API_KEY}`
      );
      const formarttedData = await result.json();

      return formarttedData["items"];
    }
    console.log("vid list empty");

    // ou retorna mensagem falando que esta vazio
  } catch (error) {
    console.error("Erro: ", error);
  }
}
// == END FETCHES ==

async function organizeVideoDetails() {
  const videosList = await fetchSearchTerm(); //detalhes de videosList
  const videosFiltered = await fetchVideosDetails(); //detalhes de videosList

  let videosDetails = [];

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

    console.log(videosDetails);
  }
  renderVideosThumb(videosDetails);
}

function renderVideosThumb(videosDetails = []) {
  if (videosDetails && videosDetails.length > 0) {
    videosDetails.forEach((video) => {
      videosGroupDiv.innerHTML += `
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

// funcao adiciona tempo nos dias da semana

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

submitBtn.addEventListener("click", () => {
  if (keyword !== "") {
    organizeVideoDetails();
  } else {
    console.log("erro");
  }
});
