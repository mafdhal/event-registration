var app = new Vue({
    el: '#app',
    data: {
        events: [],
        config: {
            title: '',
            description: '',
            colors: [
                "38839C",
                "1BB098",
                "3C4B53",
                "C7E6EC"
            ]
        },
        registerToggle: [],
        regDetails: {
            fullName: '',
            email: '',
            phone: ''
        },
        disableRegister: false,
        dbConnected: true
    },
    methods: {
        getConfigDetails: function() {
            this.$http.get('/api/config').then(response => {
                if (response.body.title) {
                    this.config = response.body;
                }
            }, response => {
                console.log(response);
            });
        },
        loadEventsAndInstances: function() {
            this.$http.get('/api/events/all').then(response => {
                if (response.data == "No Database Connected") {
                    app.dbConnected = false;
                }
                response.data.forEach(function(el) {
                    app.getEvent(el.id)
                })
            }, response => {
                console.log(response);
            });
        },
        getEvent: function(id) {
            this.$http.get('/api/event/' + id).then(response => {
                response.data.instances.forEach(function(i) {
                    i.date = moment(i.date).format('Do MMMM YYYY');
                })
                this.events.push(response.data)
                this.registerToggle.push(false)
            }, response => {
                console.log(response);
            })
        },
        displayRegister: function(index, idx) {
            if (this.disableRegister === false) {
                Vue.set(this.registerToggle, index, !this.registerToggle[index])
                this.regDetails.eventID = this.events[index]._id;
                this.regDetails.instanceID = this.events[index].instances[idx].id;
                this.regDetails.eventTitle = this.events[index].title;
                this.regDetails.date = this.events[index].instances[idx].date;
                this.regDetails.location = this.events[index].instances[idx].location;
                this.disableRegister = true;
            }
        },
        register: function(index) {
            if (this.regDetails.fullName == '' || this.regDetails.email == '' || this.regDetails.phone == '') {
                alert('Name, email and phone number required')
            } else {
                this.$http.post('/api/registration', this.regDetails).then(response => {
                    alert('Registration Successful');
                }, response => {
                    console.log(response);
                })
                this.disableRegister = false;
                Vue.set(this.registerToggle, index, !this.registerToggle[index])
            }
        }
    },
    mounted: function() {
        this.getConfigDetails()
        this.loadEventsAndInstances()
    },
    computed: {
        colors: function() {
            var arr = this.config.colors.map(function(e) {
                return '#' + e
            });
            return arr
        },
        backgroundColor1: function() {
            return {
                'background-color': this.colors[0]
            }
        },
        backgroundColor2: function() {
            return {
                'background-color': this.colors[1]
            }
        },
        backgroundColor3: function() {
            return {
                'background-color': this.colors[2]
            }
        },
        backgroundColor4: function() {
            return {
                'background-color': this.colors[3]
            }
        },
        fontColor1: function() {
            return {
                'color': this.colors[0]
            }
        },
        fontColor2: function() {
            return {
                'color': this.colors[1]
            }
        },
        fontColor3: function() {
            return {
                'color': this.colors[2]
            }
        },
        fontColor4: function() {
            return {
                'color': this.colors[3]
            }
        },
        borderColor3: function() {
            return {
                'border-color': this.colors[2]
            }
        },
        borderColor2: function() {
            return {
                'border-color': this.colors[1]
            }
        }
    }
})