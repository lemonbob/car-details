import getData from './getData.js';

const app = new Vue({
    el: "#app",
    data: {
        carData: [],
        dataLoaded: false,
        scrollStart: 0,
        scrollMove: 0,
        scollCurrentPosition: 0,
        scollLastPosition: 0,
        windowWidth: 0,
        maxScrollWidth: 0,
        noScroll: false
    },

    mounted() {
        this.onFindCarData();
        document.addEventListener('mousemove', this.moveScroll);
        document.addEventListener('mouseup', this.resetScroll);
        window.addEventListener('resize', this.onGetWindowWidth);
    },
    destroy() {
        document.removeEventListener('mousemove', this.moveScroll);
        document.removeEventListener('mouseup', this.resetScroll);
        window.removeEventListener('resize', this.onGetWindowWidth);
    },
    template: `
<div class="car-app">
<div class="car-header"><img src="../images/jaguar_small.png"></div>
<div class="car-carousel" @mousedown="startScroll"> 
<div class="car-wrapper" 
    :class="{'car-wrapper--loaded': dataLoaded === true}"
    :style="{transform:'translate(' + scollCurrentPosition + 'px, 0)'}"
    ref="carWrapper">
    <div v-for="(car, index) in carData"
    class="car-wrapper_item"
    :key="index"    
    ><img 
    class="car-wrapper_image" 
    :src="car.imageUrl">
    <div class="car-details">
        <div class="car-details_name">
        {{car.id}}</div>
        <div class="car-details_price">
        From {{car.price}}</div>
        <div class="car-details_description">
        {{car.description}}</div>
    </div>    
    </div> 
</div>
</div>
<div class="car-footer"
v-show="noScroll === false"
>
&#10094; click & drag above view &#10095;  
</div>
<footer class="car-footer car-footer--light">
    <p>Car Ajax Data by M J Livesey</p>
    <p>&copy; 2020 Polymathic Design</p>
</footer>
</div>
`,
    methods: {
        /**
         * @public
         * @description
         * asynchronous call to ajax fetch car data from server
         */
        async onFindCarData() {
            this.carData = [];
            let data = await getData.fetch();
            for (let i = 0; i < data.length; i++) {
                let newCarData = await getData.fetch(data[i].id);
                newCarData.imageUrl = getData.carImageUrl(data[i].media);
                this.carData.push(newCarData);
            }
            this.dataLoaded = true;
            this.$nextTick(() => {
                this.setMaxScrollWidth();
                this.onGetWindowWidth();
            });
        },
        /**
         * @public
         * @description
         * sets start position of scroll
         * @params {Object} e
         */
        startScroll(e) {
            if (this.noScroll === false) {
                e.preventDefault();
                if (e.type === 'mousedown') {
                    this.scrollStart = e.pageX;
                }
            }
        },
        /**
        * @public
        * @description
        * sets move location of scroll
        * @params {Object} e
        */
        moveScroll(e) {
            if (this.noScroll === false) {
                e.preventDefault();
                if (this.scrollStart !== 0) {
                    let dx;
                    this.scrollMove = e.pageX;
                    dx = this.scrollMove - this.scrollStart;
                    this.scollCurrentPosition = this.scollLastPosition + dx;
                    if (this.scollCurrentPosition < this.windowWidth - this.maxScrollWidth) {
                        this.scollCurrentPosition = this.windowWidth - this.maxScrollWidth;
                    }
                    if (this.scollCurrentPosition > 0) {
                        this.scollCurrentPosition = 0;
                    }
                }
            }
        },
        /**
        * @public
        * @description
        * resets location of scroll on mouseup
        * @params {Object} e
        */
        resetScroll() {
            this.scrollStart = 0;
            this.scrollMove = 0;
            this.scollLastPosition = this.scollCurrentPosition;
        },
        /**
        * @public
        * @description
        * gets the bounding rect of the window - used to set maximum scroll x
        */
        onGetWindowWidth() {
            let rect;
            rect = document.body.getBoundingClientRect();
            this.windowWidth = rect.width;
            //reset for tablets phone
            if (this.windowWidth <= 1024) {
                this.scollCurrentPosition = 0;
                this.noScroll = true;
            } else {
                this.setMaxScrollWidth();
                if (this.scollCurrentPosition !== 0 && this.windowWidth - this.scollCurrentPosition >= this.maxScrollWidth) {
                    this.scollCurrentPosition = this.windowWidth - this.maxScrollWidth;
                }
                if (this.maxScrollWidth < this.windowWidth) {
                    this.scollCurrentPosition = (this.windowWidth - this.maxScrollWidth)/2 ;
                    this.noScroll = true;
                } else {
                    this.noScroll = false;
                }
            }
        },
        /**
       * @public
       * @description
       * sets the maximum scroll width
       */
        setMaxScrollWidth() {
            let rect = this.$refs.carWrapper.firstChild.getBoundingClientRect();
            this.maxScrollWidth = rect.width * this.carData.length;
        }
    },
});