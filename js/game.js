//declaring constants
const stage = document.getElementById('main-stage'),
    timer = document.getElementById('timer'),
    message = document.getElementById('message'),
    chances = document.getElementById('clicks'),
    score = document.getElementById('score'),
    info_window = document.getElementById('side-bar'),
    home_window = document.getElementById('home'),
    replay_window = document.getElementById('instr'),
    replay_button = document.getElementById('refresh'),
    svgns = "http://www.w3.org/2000/svg",
    color_pallete = ['#d4145a', '#fcee21', '#9e35cd', '#26dd67', '#0dd8f1', '#f76ebd', '#4c3cdd', '#eb423d'];
stage.setAttribute('height', 500);
stage.setAttribute('width', 500);
//function for drawing circles-
let draw_circle = (position, level) => {
    for (let i = 0; i < level.length; i++) {
        let tmp = position[i];
        let circle = document.createElementNS(svgns, 'circle');
        let style = 'fill:' + color_pallete[i];
        circle.setAttributeNS(null, 'cx', tmp[0]);
        circle.setAttributeNS(null, 'cy', tmp[1]);
        circle.setAttributeNS(null, 'r', 30);
        circle.setAttributeNS(null, 'class', 'circles');
        circle.setAttributeNS(null, 'id', i);
        circle.setAttributeNS(null, 'style', style);
        stage.appendChild(circle);
    }
}
//function for drawing lines
let draw_line = (position, level, line_id, connected) => {
    let count_lines = 0;
    for (let i = 0; i < level.length; i++) {
        let nodes = level[i],
            point = position[i],
            x1 = point[0],
            y1 = point[1];
        line_id[i] = new Array(); //stores the line position for each circle
        connected[i] = 0; //number of lines connected to each circle
        for (let j = 0; j < nodes.length; j++) {
            let line = document.createElementNS(svgns, 'line'),
                x2 = position[nodes[j]][0],
                y2 = position[nodes[j]][1];
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', color_pallete[i]);
            line.setAttributeNS(null, 'class', nodes[j]);
            stage.appendChild(line);
            line_id[i].push(count_lines);
            count_lines++;
            connected[i]++;
        }
    }
}
//function for timer
let set_timer = () => {
    timenow--;
    timer.innerHTML = timenow;
    if (timenow == 0) {
        clearInterval(countdown);
        message.innerHTML = 'Time Up! Give another try.';
        replay_window.style.visibility = 'visible';
    }
}
let score_set = 0,
curr_stage = 0;
update = (num) => {
    stage.innerHTML = ''; // clear the screen
    let level = levels[num],// get level number from data
        position = positions[num],
        connected = [], //array for checking how many circles have been clicked
        line_id = [], //storing the lines
        visited = [], //check if a circle has already been clicked
        click = 0;
    timenow = 10; //initial time
    timer.innerHTML = timenow;
    score.innerHTML = score_set;
    chances.innerHTML = num_clicks[num];
    draw_line(position, level, line_id, connected); //draw lines on screen
    draw_circle(position, level);
    countdown = setInterval(set_timer, 1000);
    let getCircle = document.querySelectorAll('.circles'),
        tmp_click = num_clicks[num],
        getLine = document.querySelectorAll('line');
    //setting the default refresh screen
    replay_button.innerHTML = 'Try Again';
    replay_window.style.backgroundColor = '#546efa';
    //mark all circles as unvisited 
    for (let i = 0; i < getCircle.length; i++) visited[i] = false;
    //event listener for each circle
    for (let i = 0; i < getCircle.length; i++) {
        getCircle[i].addEventListener('click', function (e) {
            if (!visited[i] && click <= num_clicks[num]) {
                click++;
                tmp_click--;
                visited[i] = true;
            }
            //number of moves remaining
            if (tmp_click >= 0) chances.innerHTML = tmp_click;
            let index = this.getAttribute('id'), //get the id of each circle
                self_index = document.getElementsByClassName(index);
            connected[index] = 0; //the circle clicked now has zero connections
            for (let j = 0; j < line_id[index].length; j++) {
                //gets the line number the circle is connected to
                let elem = getLine[line_id[index][j]];
                if (elem.getAttribute('stroke') != 'black') {
                    elem.setAttribute('stroke', 'black');
                    self_index[j].setAttribute('stroke', 'black');
                    let node_index = elem.getAttribute('class');
                    connected[node_index]--;
                }
            }
            count = 0;
            for (let j = 0; j < getCircle.length; j++) {
                if (connected[j] == 0) {
                    getCircle[j].setAttributeNS(null, 'style', 'fill: #666666; stroke: blue; stroke-width: 1px;');
                    count++;
                }
            }
            //checks if all circles have been visited within time and moves
            if (count == getCircle.length && timenow > 0 && click <= num_clicks[num]) {
                clearInterval(countdown);
                score_set += 100;
                score.innerHTML = score_set;
                num++;
                //all levels are completed
                if (num >= 7) {
                    message.innerHTML = 'Congratulations! You completed all the levels.';
                    replay_window.style.visibility = 'visible';
                    replay_window.style.backgroundColor = '#c7062b';
                    clearInterval(countdown);
                    replay_button.innerHTML = 'Play Again';
                    num = 0;
                    curr_stage = 0;
                    score_set = 0;
                } else update(num);
            } else if (click >= num_clicks[num]) {
                clearInterval(countdown);
                message.innerHTML = 'Out of Moves.Try Again';
                replay_window.style.visibility = 'visible';
            }
            //gets the current level number
            curr_stage = num;
        })
    }
}
//try again button
replay_button.addEventListener('click', function () {
    replay_window.style.visibility = 'hidden';//hide the screen
    update(curr_stage);//updates the current stage
})
//start button in the home page
document.getElementById('start').addEventListener('click', function () {
    replay_window.style.visibility = 'hidden';
    home_window.style.visibility = 'hidden';
    info_window.style.display = 'block';
    score_set = 0;
    update(0);
});
//exits to the main page
document.getElementById('home-button').addEventListener('click', function () {
    stage.innerHTML = "";
    home_window.style.visibility = 'visible';
    info_window.style.display = 'none';
    replay_window.style.visibility = 'hidden';
})
