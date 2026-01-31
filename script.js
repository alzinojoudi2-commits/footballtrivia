// Football Trivia Duel (Hasan vs Eric) — hot-seat multiplayer
// Built-in long question bank: 60 questions (20 easy, 20 medium, 20 hard).
// Scoring: Easy=10, Medium=20, Hard=30 + streak bonus.
// Winner prize: mustache kiss (as requested).
const $ = (id)=>document.getElementById(id);
const UI = {
  p1Name: $("p1Name"), p2Name: $("p2Name"),
  length: $("length"), timer: $("timer"),
  startBtn: $("startBtn"),
  p1Label: $("p1Label"), p2Label: $("p2Label"),
  p1Score: $("p1Score"), p2Score: $("p2Score"),
  p1Streak: $("p1Streak"), p2Streak: $("p2Streak"),
  roundLabel: $("roundLabel"), qLabel: $("qLabel"), turnLabel: $("turnLabel"),
  statusLine: $("statusLine"), question: $("question"), answers: $("answers"),
  feedback: $("feedback"), nextBtn: $("nextBtn"), passBtn: $("passBtn"),
  timeLeft: $("timeLeft"),
  final: $("final"),
  saveBtn: $("saveBtn"), loadBtn: $("loadBtn"), resetBtn: $("resetBtn"),
};
const POINTS = { easy:10, med:20, hard:30 };
// Question format: {d:"easy|med|hard", q:"", choices:["A","B","C","D"], correct: index, expl:""}
const BANK = [
  // EASY (20)
  {d:"easy", q:"How many players are on the field for one team in a standard match?", choices:["9","10","11","12"], correct:2, expl:"A standard team fields 11 players."},
  {d:"easy", q:"What is the name of the area in front of the goal where the goalkeeper can use hands?", choices:["Penalty area","Center circle","Corner arc","Touchline"], correct:0, expl:"The penalty area (18-yard box)."},
  {d:"easy", q:"What do you call restarting play from the corner arc after the ball crosses the goal line off a defender?", choices:["Throw-in","Corner kick","Goal kick","Drop ball"], correct:1, expl:"That’s a corner kick."},
  {d:"easy", q:"Which card color means a player is sent off?", choices:["Green","Yellow","Red","Blue"], correct:2, expl:"Red card = sent off."},
  {d:"easy", q:"What is it called when the ball fully crosses the sideline?", choices:["Out of play","Offside","Handball","Advantage"], correct:0, expl:"Ball fully over the touchline = out of play."},
  {d:"easy", q:"How long is a standard professional match (not including stoppage time)?", choices:["60 minutes","70 minutes","80 minutes","90 minutes"], correct:3, expl:"Two halves of 45 minutes = 90."},
  {d:"easy", q:"What is the circular mark at midfield called?", choices:["Penalty spot","Center circle","D-box","Goal arc"], correct:1, expl:"Center circle."},
  {d:"easy", q:"A goal is scored when the whole ball crosses the…", choices:["Touchline","Halfway line","Goal line between the posts","Corner arc"], correct:2, expl:"It must fully cross the goal line between the posts and under the bar."},
  {d:"easy", q:"What’s the restart called when the attacking team kicks from the penalty spot?", choices:["Free kick","Penalty kick","Goal kick","Corner kick"], correct:1, expl:"Penalty kick."},
  {d:"easy", q:"What’s the restart when the ball goes out off an attacker over the goal line?", choices:["Corner kick","Goal kick","Throw-in","Indirect free kick"], correct:1, expl:"Goal kick."},
  {d:"easy", q:"Which position typically wears gloves and can handle the ball in the penalty area?", choices:["Striker","Goalkeeper","Center back","Winger"], correct:1, expl:"Goalkeeper."},
  {d:"easy", q:"What do we call kicking the ball to a teammate?", choices:["Tackle","Pass","Save","Header"], correct:1, expl:"Pass."},
  {d:"easy", q:"What’s the kick called to restart after a foul with a direct shot allowed?", choices:["Direct free kick","Indirect free kick","Throw-in","Drop ball"], correct:0, expl:"Direct free kick."},
  {d:"easy", q:"Which surface is NOT allowed to touch the ball (normally) for outfield players?", choices:["Head","Chest","Foot","Hand/arm"], correct:3, expl:"Hand/arm is generally not allowed."},
  {d:"easy", q:"What is the name of the competition where national teams play for a global title every four years?", choices:["Champions League","World Cup","Europa League","Copa del Rey"], correct:1, expl:"FIFA World Cup."},
  {d:"easy", q:"What is a group of defenders lined up to block a free kick called?", choices:["Wall","Fence","Shield","Gate"], correct:0, expl:"A wall."},
  {d:"easy", q:"Which term means a player is positioned illegally ahead of the defenders when the ball is played to them?", choices:["Offside","Onside","Timeout","Kickoff"], correct:0, expl:"Offside."},
  {d:"easy", q:"A match begins with a…", choices:["Throw-in","Kickoff","Corner","Penalty"], correct:1, expl:"Kickoff at the center spot."},
  {d:"easy", q:"What do you call a player who primarily attacks and scores goals?", choices:["Striker","Fullback","Goalkeeper","Sweeper"], correct:0, expl:"Striker/forward."},
  {d:"easy", q:"What do fans call scoring three goals in one match?", choices:["Triple","Hat-trick","Three-peat","Treble"], correct:1, expl:"Hat-trick."},
  // MEDIUM (20)
  {d:"med", q:"What is the maximum number of substitutions allowed in most modern competitions (standard rule set)?", choices:["1","3","5","Unlimited"], correct:2, expl:"Many competitions now allow up to 5 subs (competition-dependent)."},
  {d:"med", q:"Which restart is awarded for a non-dangerous backpass handled by the goalkeeper?", choices:["Penalty","Indirect free kick","Drop ball","Corner"], correct:1, expl:"Handling a deliberate backpass = indirect free kick."},
  {d:"med", q:"A ‘treble’ usually refers to winning…", choices:["3 matches in a row","3 trophies in a season","3 penalties","3 derbies"], correct:1, expl:"Typically league + main cup + continental title."},
  {d:"med", q:"What does VAR stand for?", choices:["Video Assistant Referee","Verified Action Replay","Virtual Attack Review","Video Angle Recorder"], correct:0, expl:"Video Assistant Referee."},
  {d:"med", q:"Which of these is NOT an official on-field referee signal device?", choices:["Whistle","Cards","Spray foam","Red flag"], correct:3, expl:"Refs use whistle/cards/spray; not a red flag."},
  {d:"med", q:"In most leagues, a win awards how many points in the table?", choices:["1","2","3","5"], correct:2, expl:"Win = 3 points."},
  {d:"med", q:"What’s the term for the last defender line a striker tries to beat when timing runs?", choices:["Back line","Offside line","Goal arc","Midfield line"], correct:1, expl:"Offside line."},
  {d:"med", q:"What is the name of the rule that allows play to continue after a foul if it benefits the fouled team?", choices:["Advantage","Momentum","Continuation","Flow"], correct:0, expl:"Advantage."},
  {d:"med", q:"Which competition is primarily for European clubs?", choices:["AFCON","UEFA Champions League","CONMEBOL Libertadores","AFC Asian Cup"], correct:1, expl:"UEFA Champions League."},
  {d:"med", q:"What’s the common nickname for a match between two clubs from the same city/region?", choices:["Finale","Derby","Classic","Showdown"], correct:1, expl:"Derby."},
  {d:"med", q:"A ‘clean sheet’ means…", choices:["No fouls committed","No goals conceded","No shots taken","No corners conceded"], correct:1, expl:"Goalkeeper/team conceded zero goals."},
  {d:"med", q:"What part of the foot is usually used for a powerful long shot?", choices:["Toe only","Heel","Instep (laces)","Outside edge only"], correct:2, expl:"Instep/laces for power."},
  {d:"med", q:"What does ‘park the bus’ mean?", choices:["Time wasting at corner flag","Very defensive setup","High pressing","Switching formations midgame"], correct:1, expl:"Sitting deep/defending heavily."},
  {d:"med", q:"Which is a legal method to restart play after the ball hits the referee (modern law may stop play depending on impact)?", choices:["Drop ball","Throw-in","Indirect free kick","Penalty"], correct:0, expl:"Often restarted with a drop ball depending on the situation."},
  {d:"med", q:"Which is typically a defender position?", choices:["Center back","Number 10","Second striker","False 9"], correct:0, expl:"Center back is a defender."},
  {d:"med", q:"What’s the name of the arc on top of the penalty area?", choices:["D","Halo","Crescent","Shield"], correct:0, expl:"The ‘D’ (penalty arc)."},
  {d:"med", q:"Which term means a player dribbles past an opponent with skill?", choices:["Nutmeg","Tackle","Clearance","Offload"], correct:0, expl:"Nutmeg is one flashy dribble move."},
  {d:"med", q:"What do we call a pass that splits defenders into space for a runner?", choices:["Square ball","Through ball","Back pass","Hospital pass"], correct:1, expl:"Through ball."},
  {d:"med", q:"Which is a standard formation notation?", choices:["4-4-2","7-2-9","3-8-1","2-2-2-2-2"], correct:0, expl:"4-4-2 is a classic formation."},
  {d:"med", q:"A ‘header’ is when you play the ball with your…", choices:["Chest","Head","Knee","Shoulder"], correct:1, expl:"Head."},
  // HARD (20)
  {d:"hard", q:"In the Laws of the Game, offside position is judged at the moment the ball is…", choices:["Received","Kicked/played by a teammate","Crosses the box","Crosses halfway"], correct:1, expl:"Offside is judged when the teammate plays the ball."},
  {d:"hard", q:"Which situation is NOT an offside offense by itself?", choices:["Standing in offside position","Interfering with play","Interfering with an opponent","Gaining advantage from being in offside position"], correct:0, expl:"Offside position alone is not an offense."},
  {d:"hard", q:"What is the term for a defender clearing the ball away from danger?", choices:["Press","Clearance","Layoff","Dummy"], correct:1, expl:"Clearance."},
  {d:"hard", q:"A ‘false 9’ is best described as…", choices:["A striker who drops deep to link play","A defender who attacks","A goalkeeper who dribbles","A winger who never crosses"], correct:0, expl:"False 9 drops deep, pulling defenders."},
  {d:"hard", q:"In many tactical systems, ‘inverted wingers’ usually…", choices:["Stay wide and cross only","Cut inside onto their stronger foot","Play as center backs","Never shoot"], correct:1, expl:"They cut inside (often opposite-footed)."},
  {d:"hard", q:"Which is the best definition of ‘pressing trigger’?", choices:["A foul","A cue to start pressing as a unit","A pass to the striker","A corner routine"], correct:1, expl:"Team cue to press (e.g., bad touch/back pass)."},
  {d:"hard", q:"What is ‘counter-pressing’ (gegenpressing) broadly?", choices:["Defending only in your box","Pressing immediately after losing the ball","Long-ball attacking","Man-marking the referee"], correct:1, expl:"Immediate pressure right after losing possession."},
  {d:"hard", q:"Which pass is most associated with switching play quickly?", choices:["Diagonal switch","Short back pass","Toe poke","Dummy run"], correct:0, expl:"A diagonal switch changes the point of attack."},
  {d:"hard", q:"A ‘half-space’ in tactics refers to…", choices:["Area between wing and center channel","The penalty spot","The center circle","The technical area"], correct:0, expl:"Between wide and central zones."},
  {d:"hard", q:"What does ‘overlapping fullback’ mean?", choices:["Fullback runs outside a winger to attack","Fullback stands still","Fullback becomes goalkeeper","Fullback only clears long"], correct:0, expl:"Overlapping run outside the winger."},
  {d:"hard", q:"In a 4-3-3, the single pivot is typically…", choices:["The lone defensive midfielder","The striker","The left back","The referee"], correct:0, expl:"Single pivot = holding midfielder."},
  {d:"hard", q:"Which concept describes drawing defenders to one side then attacking the other?", choices:["Overload-to-isolate","Time wasting","Route one","Zonal marking"], correct:0, expl:"Overload one side to isolate elsewhere."},
  {d:"hard", q:"A ‘cutback’ cross is played…", choices:["From byline back toward the penalty spot/edge","High to the far post always","Backward to the goalkeeper","Straight out for a throw"], correct:0, expl:"Pulled back from near the byline into dangerous central areas."},
  {d:"hard", q:"What is zonal marking?", choices:["Defending areas instead of specific players","Marking only the striker","Marking the ball only","Not marking anyone"], correct:0, expl:"Players cover zones rather than man-marking."},
  {d:"hard", q:"A ‘press-resistant’ midfielder is one who…", choices:["Avoids the ball","Keeps the ball under pressure","Only shoots long","Only tackles"], correct:1, expl:"Can receive/turn/pass while being pressed."},
  {d:"hard", q:"What’s a ‘third-man run’?", choices:["A run from a player not directly involved in the initial pass","A goalkeeper sprint","A referee run","A throw-in routine only"], correct:0, expl:"A third player makes the key run to receive after a layoff."},
  {d:"hard", q:"What is ‘rest defense’?", choices:["The shape maintained to prevent counters while attacking","Parking the bus for 90 minutes","A halftime nap","Only defending corners"], correct:0, expl:"Your defensive structure while in possession."},
  {d:"hard", q:"A ‘line-breaking pass’ generally…", choices:["Bypasses one or more defensive lines","Goes sideways only","Always goes to the keeper","Is always a cross"], correct:0, expl:"It breaks through midfield/defensive lines."},
  {d:"hard", q:"In buildup play, ‘width’ is mainly provided by…", choices:["Wide players/fullbacks","Only center backs","Only striker","Only referee"], correct:0, expl:"Wingers/fullbacks stretch the field."},
  {d:"hard", q:"‘Tempo’ in possession refers to…", choices:["Speed/rhythm of ball circulation and actions","Number of fouls","Kit color","Distance to goal"], correct:0, expl:"How fast and rhythmic the play is."},
  // EXTRA (make it 60 total by adding more per difficulty in the same style)
  // EASY extras (to reach 60 in Epic mode) — 10 more
  {d:"easy", q:"What’s the official restart after a goal?", choices:["Throw-in","Kickoff","Corner","Drop ball"], correct:1, expl:"Kickoff."},
  {d:"easy", q:"What do you call a kick taken from the sideline to restart play?", choices:["Goal kick","Throw-in","Penalty","Free kick"], correct:1, expl:"Throw-in."},
  {d:"easy", q:"Which part of the goal is the horizontal bar?", choices:["Post","Crossbar","Net","Line"], correct:1, expl:"Crossbar."},
  {d:"easy", q:"What do you call the person who enforces the rules on the field?", choices:["Coach","Referee","Captain","Manager"], correct:1, expl:"Referee."},
  {d:"easy", q:"A pass made with the head is called a…", choices:["Header","Volley","Dribble","Tackle"], correct:0, expl:"Header."},
  {d:"easy", q:"What’s a player called who plays wide in attack?", choices:["Winger","Sweeper","Keeper","Stopper"], correct:0, expl:"Winger."},
  {d:"easy", q:"If the ball hits the net behind the goal but didn’t cross the line, is it a goal?", choices:["Yes","No"], correct:1, expl:"Ball must fully cross the goal line."},
  {d:"easy", q:"What’s the start of each half called?", choices:["Kickoff","Drop ball","Throw-in","Corner"], correct:0, expl:"Kickoff."},
  {d:"easy", q:"What do you call moving with the ball at your feet?", choices:["Dribbling","Marking","Clearing","Saving"], correct:0, expl:"Dribbling."},
  {d:"easy", q:"What does a yellow card generally indicate?", choices:["Warning/caution","Goal","Substitution","Offside"], correct:0, expl:"Yellow card = caution."},
  // MED extras — 5 more
  {d:"med", q:"A ‘near post’ run is made toward…", choices:["Closest goalpost to the ball","Farthest post","Halfway line","Corner flag only"], correct:0, expl:"Near post is closest to the ball/crosser."},
  {d:"med", q:"A ‘sweeper keeper’ is known for…", choices:["Staying on line always","Playing higher to clear through balls","Never passing","Only saving penalties"], correct:1, expl:"They come off the line to sweep behind defense."},
  {d:"med", q:"A ‘box-to-box’ midfielder typically…", choices:["Stays only in defense","Covers lots of ground both ways","Never tackles","Only takes corners"], correct:1, expl:"Box-to-box covers defense + attack."},
  {d:"med", q:"What does ‘man marking’ mean?", choices:["Marking a zone","Tracking a specific player","Marking the ball only","Not defending"], correct:1, expl:"Tracking a specific opponent."},
  {d:"med", q:"A ‘low block’ means the team defends…", choices:["High up the pitch","Deep near their own box","Only at halfway","Only in attack"], correct:1, expl:"Low block = deep defensive shape."},
  // HARD extras — 5 more
  {d:"hard", q:"A ‘double pivot’ usually refers to…", choices:["Two holding midfielders","Two strikers","Two goalkeepers","Two referees"], correct:0, expl:"Two deeper midfielders in buildup/defense."},
  {d:"hard", q:"What is ‘compactness’ in defending?", choices:["Spacing tight between lines/players","Everyone spreads out","Only wing play","Only long balls"], correct:0, expl:"Tight spacing reduces gaps."},
  {d:"hard", q:"A ‘blindside run’ attacks…", choices:["Defender’s side where they can’t see runner easily","Goalkeeper directly","Referee position","Corner flag"], correct:0, expl:"Runner moves into defender’s blind spot."},
  {d:"hard", q:"What is ‘verticality’ in attack?", choices:["Forward/progressive play toward goal","Only sideways passing","Only defending","Only crossing"], correct:0, expl:"Attacking with forward progression."},
  {d:"hard", q:"What does ‘screening the back line’ mean for a defensive mid?", choices:["Blocking passing lanes into attackers","Taking corners","Overlapping fullback","Switching wings"], correct:0, expl:"They block lanes into forwards/10s."},
];
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function getMatchCount(mode){
  if(mode==="short") return 15;
  if(mode==="standard") return 30;
  if(mode==="long") return 45;
  return 60;
}
let S = null;
let timerId = null;
let lock = false;
function init(){
  const p1 = UI.p1Name.value.trim() || "Hasan";
  const p2 = UI.p2Name.value.trim() || "Eric";
  const total = getMatchCount(UI.length.value);
  const seconds = parseInt(UI.timer.value, 10);
  // Build question list: easy -> med -> hard progression
  const easy = BANK.filter(x=>x.d==="easy");
  const med  = BANK.filter(x=>x.d==="med");
  const hard = BANK.filter(x=>x.d==="hard");
  const needPer = Math.ceil(total/3);
  const qList = [
    ...shuffle(easy).slice(0, needPer),
    ...shuffle(med).slice(0, needPer),
    ...shuffle(hard).slice(0, total - 2*needPer),
  ];
  S = {
    players:[
      {name:p1, score:0, streak:0},
      {name:p2, score:0, streak:0},
    ],
    qList,
    idx: 0,
    turn: 0,
    seconds,
    timeLeft: seconds,
    answered: false,
    lastWasCorrect: null,
  };
  UI.p1Label.textContent = p1;
  UI.p2Label.textContent = p2;
  UI.final.classList.add("hidden");
  UI.nextBtn.disabled = true;
  UI.passBtn.disabled = false;
  renderMeta();
  loadQuestion();
}
function difficultyForIndex(i,total){
  const third = total/3;
  if(i < third) return "EASY";
  if(i < 2*third) return "MEDIUM";
  return "HARD";
}
function renderMeta(){
  const total = S.qList.length;
  UI.roundLabel.textContent = difficultyForIndex(S.idx, total);
  UI.qLabel.textContent = `${S.idx+1} / ${total}`;
  UI.turnLabel.textContent = S.players[S.turn].name;
  UI.p1Score.textContent = S.players[0].score;
  UI.p2Score.textContent = S.players[1].score;
  UI.p1Streak.textContent = S.players[0].streak;
  UI.p2Streak.textContent = S.players[1].streak;
}
function setStatus(text){ UI.statusLine.textContent = text; }
function clearTimer(){
  if(timerId){ clearInterval(timerId); timerId=null; }
}
function startTimer(){
  clearTimer();
  if(!S.seconds){ UI.timeLeft.textContent = "∞"; return; }
  S.timeLeft = S.seconds;
  UI.timeLeft.textContent = `${S.timeLeft}s`;
  timerId = setInterval(()=>{
    if(lock) return;
    S.timeLeft--;
    UI.timeLeft.textContent = `${S.timeLeft}s`;
    if(S.timeLeft <= 0){
      clearTimer();
      if(!S.answered){
        autoTimeout();
      }
    }
  }, 1000);
}
function loadQuestion(){
  lock = false;
  UI.feedback.classList.remove("show");
  UI.feedback.textContent = "";
  UI.answers.innerHTML = "";
  UI.nextBtn.disabled = true;
  S.answered = false;
  S.lastWasCorrect = null;
  const q = S.qList[S.idx];
  UI.question.textContent = q.q;
  setStatus(`Turn: ${S.players[S.turn].name} • Answer carefully (yesterday’s argument is watching).`);
  q.choices.forEach((c, i)=>{
    const b = document.createElement("button");
    b.className = "btn answerBtn";
    b.textContent = `${String.fromCharCode(65+i)}. ${c}`;
    b.onclick = ()=> answer(i);
    UI.answers.appendChild(b);
  });
  startTimer();
  renderMeta();
}
function scoreFor(d){ return POINTS[d] || 10; }
function streakBonus(streak){
  // small, fun bonus, capped
  return Math.min(10, streak*2);
}
function answer(choiceIdx){
  if(S.answered) return;
  S.answered = true;
  clearTimer();
  const q = S.qList[S.idx];
  const correct = (choiceIdx === q.correct);
  const P = S.players[S.turn];
  if(correct){
    P.streak++;
    const base = scoreFor(q.d);
    const bonus = streakBonus(P.streak);
    P.score += (base + bonus);
    S.lastWasCorrect = true;
    showFeedback(true, `Correct ✅ +${base}+${bonus} (streak bonus). ${q.expl}`);
  } else {
    P.streak = 0;
    S.lastWasCorrect = false;
    showFeedback(false, `Wrong ❌ Correct answer: ${String.fromCharCode(65+q.correct)}. ${q.choices[q.correct]}. ${q.expl}`);
  }
  // disable answer buttons
  [...UI.answers.children].forEach((b, i)=>{
    b.disabled = true;
    if(i === q.correct) b.style.borderColor = "rgba(52,211,153,.6)";
  });
  UI.nextBtn.disabled = false;
  UI.passBtn.disabled = false;
  renderMeta();
}
function autoTimeout(){
  if(S.answered) return;
  S.answered = true;
  const q = S.qList[S.idx];
  const P = S.players[S.turn];
  P.streak = 0;
  S.lastWasCorrect = false;
  showFeedback(false, `⏱️ Time! No answer. Correct was ${String.fromCharCode(65+q.correct)}. ${q.choices[q.correct]}. ${q.expl}`);
  [...UI.answers.children].forEach((b, i)=>{
    b.disabled = true;
    if(i === q.correct) b.style.borderColor = "rgba(52,211,153,.6)";
  });
  UI.nextBtn.disabled = false;
  renderMeta();
}
function showFeedback(ok, text){
  UI.feedback.classList.add("show");
  UI.feedback.textContent = text;
  UI.feedback.style.borderColor = ok ? "rgba(52,211,153,.45)" : "rgba(251,113,133,.45)";
}
function passPhone(){
  // Friendly “turn handoff”
  if(!S) return;
  lock = true;
  setStatus(`Pass phone to ${S.players[(S.turn+1)%2].name} 🔁 No peeking. Honor system.`);
  UI.question.textContent = "— PASS THE PHONE —";
  UI.answers.innerHTML = "";
  UI.nextBtn.disabled = true;
  UI.passBtn.disabled = true;
  UI.feedback.classList.remove("show");
  UI.feedback.textContent = "";
  UI.timeLeft.textContent = "—";
  const b = document.createElement("button");
  b.className = "btn primary wide";
  b.textContent = `I am ${S.players[(S.turn+1)%2].name}. Continue.`;
  b.onclick = ()=>{
    lock=false;
    S.turn = (S.turn+1)%2;
    loadQuestion();
  };
  UI.answers.appendChild(b);
}
function next(){
  if(!S) return;
  S.idx++;
  if(S.idx >= S.qList.length){
    endGame();
    return;
  }
  // auto handoff each question to keep it truly multiplayer
  passPhone();
}
function endGame(){
  clearTimer();
  const A=S.players[0], B=S.players[1];
  const winner = (A.score===B.score) ? null : (A.score>B.score ? A : B);
  const loser  = (winner===A ? B : A);
  UI.final.classList.remove("hidden");
  UI.final.innerHTML = "";
  let title = "";
  let body = "";
  if(!winner){
    title = "🤝 DRAW. The only winner is friendship (and football).";
    body = `You tied. According to international law, you must both apologize for yesterday’s argument and share one snack.`;
  } else {
    title = `🏆 ${winner.name} wins!`;
    // mustache kiss prize text
    body = `${winner.name} earns the sacred prize: <strong>a kiss on the mustache</strong> from ${loser.name}.<br><br>
            <div class="prize">
              <div><strong>Prize Ceremony:</strong></div>
              <div style="margin-top:6px;">
                If <strong>${winner.name}</strong> won: ${loser.name} must deliver a respectful, comedic “mwah” on the mustache. 😚👨‍🦰
              </div>
              <div style="margin-top:6px;">
                If <strong>${loser.name}</strong> refuses: automatic penalty = one compliment + one handshake. 🤝
              </div>
            </div>
            <br><span class="muted">Remember: brothers not by blood, but by choice.</span>`;
  }
  const recap = `Final score: ${A.name} ${A.score} — ${B.score} ${B.name}`;
  UI.final.innerHTML = `
    <h2 style="margin:0 0 6px;">${title}</h2>
    <p class="muted" style="margin:0 0 12px;">${recap}</p>
    <div>${body}</div>
    <div class="divider"></div>
    <div class="row">
      <button class="btn primary" id="again">Play again</button>
      <button class="btn ghost" id="share">Copy brag text</button>
    </div>
  `;
  $("again").onclick = ()=>{ UI.final.classList.add("hidden"); init(); };
  $("share").onclick = async ()=>{
    const text = `GOAT TRIVIA DUEL RESULT: ${recap}. Prize: mustache kiss trophy.`;
    try{ await navigator.clipboard.writeText(text); alert("Copied!"); }
    catch(e){ alert(text); }
  };
  UI.question.textContent = "Game Over";
  UI.answers.innerHTML = "";
  UI.feedback.classList.remove("show");
  UI.statusLine.textContent = "Verdict delivered. Peace treaty ready for signing.";
  UI.nextBtn.disabled = true;
  UI.passBtn.disabled = true;
  renderMeta();
}
function save(){
  if(!S) return alert("Start a game first.");
  localStorage.setItem("trivia_duel_save", JSON.stringify(S));
  alert("Saved.");
}
function load(){
  const raw = localStorage.getItem("trivia_duel_save");
  if(!raw) return alert("No save found.");
  S = JSON.parse(raw);
  UI.p1Label.textContent = S.players[0].name;
  UI.p2Label.textContent = S.players[1].name;
  UI.final.classList.add("hidden");
  renderMeta();
  loadQuestion();
}
function reset(){
  if(!confirm("Reset everything?")) return;
  localStorage.removeItem("trivia_duel_save");
  clearTimer();
  S=null;
  UI.question.textContent="—";
  UI.answers.innerHTML="";
  UI.feedback.classList.remove("show");
  UI.statusLine.textContent="Reset complete. Start again when ready.";
  UI.roundLabel.textContent="—"; UI.qLabel.textContent="—"; UI.turnLabel.textContent="—";
  UI.p1Score.textContent="0"; UI.p2Score.textContent="0"; UI.p1Streak.textContent="0"; UI.p2Streak.textContent="0";
  UI.timeLeft.textContent="—";
  UI.final.classList.add("hidden");
  UI.nextBtn.disabled=true; UI.passBtn.disabled=true;
}
UI.startBtn.onclick = init;
UI.nextBtn.onclick = next;
UI.passBtn.onclick = passPhone;
UI.saveBtn.onclick = save;
UI.loadBtn.onclick = load;
UI.resetBtn.onclick = reset;
