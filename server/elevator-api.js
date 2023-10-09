const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

//Data
var data = { //external file load
    "movement" : -1, //?
    "doors_opened" : false, //?
    "load" : 312, //?
    "current_floor" : 5,
    "floor_info" : [ //?
        {
            "floor" : 4,
            "continue_up" : true
        },
        {
            "floor" : 6,
            "continue_down" : true
        },
        {
            "floor" : 8,
            "continue_up" : true,
            "continue_down" : true
        },
        {
            "floor" : 0,
            "is_target" : true
        }
    ]
}
//Routes
app.get('/api/elevatorStatus', (req, res) => {
    res.json(data);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});