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
    createNotification("Nenhum resultado encontrado.");

    // ou retorna mensagem falando que esta vazio
  } catch (error) {
    createNotification(
      "Não foi possível listar os vídeos. Tente novamente mais tarde."
    );
    console.error("Erro: ", error);
  }
}
