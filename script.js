let repos = [];
let original;

function sortDescending(field) {
  repos.sort((a, b) => {return a[field] > b[field] ? -1 : a[field] < b[field];});
  render();
}
function sortAscending(field) {
  repos.sort((a, b) => {return a[field] < b[field] ? -1 : a[field] > b[field];});
  render();
}

function search(e) {
  if (e === "") {
    repos = original;
    render();
    return;
  }
  repos = [];
  for (let repo of original) {
    if (!repo.description) continue;
//    console.dir(repo.description);
    let regex = new RegExp(e, 'i');
    if (repo.description.match(regex)) {
      repos.push(repo);
    }
  }

  sortDescending("stars");
  render();
}

function parse(json) {
  for(let name in json) {
    repos.push({name,
      description: json[name].repo.description,
      git_url: json[name].repo.clone_url,
      stars: json[name].repo.stargazers_count,
      html_url: json[name].repo.html_url,
      owner: json[name].repo.owner.login,
      owner_url: json[name].repo.owner.html_url,
      lines: json[name].lines,
      created_at: new Date(json[name].repo.created_at),
      pushed_at: new Date(json[name].repo.pushed_at)
    });
  }
  original = repos;
}

function render() {
  let html = "";
  for(let repo of repos) {
    html = html + "<div class=\"repo\">"+
      "<h3><a href=" + repo.html_url + ">" + repo.name + "</a></h3>" +
      "<h4>" + repo.description + "</h4>" +
      "<small>" +
      "Git URL: " + repo.git_url + "<br>" +
      "Owner: <a href=\"" + repo.owner_url + "\">" + repo.owner + "</a><br>" +
      "Lines: " + repo.lines + "<br>" +
      "Stars: " + repo.stars + "<br>" +
      "Updated: " + repo.pushed_at.toLocaleDateString() + "<br>" +
      "Created: " + repo.created_at.toLocaleDateString() + "<br>" +
      "</small>" +
      "</div>";
  }
  document.getElementById("list").innerHTML = html;
}

function callback(xhttp) {
  if (xhttp.readyState == 4 && xhttp.status == 200) {
    parse(JSON.parse(xhttp.responseText));
    sortDescending('pushed_at');
  }
}

function run() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = (() => callback(xhttp));
  xhttp.open("GET", "http://generated.dotabap.org/generated.json", true);
  xhttp.send();
}
