// 1. phần select option chưa làm


const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const body = $('.body')
const playButton = $('.play-button')
const playList = $('.play-list')
const heading = $('.header > h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const progress = $('.progress')
const nextBtn = $('.next-button')
const prevBtn = $('.prev-button')
const randomBtn = $('.random-btn')
const replayBtn = $('.replay-button')
const volumeBtn = $('.volume-button')
const cd = $('.CD')
const volumeScroller = $('.scroller')
const cdWidth = cd.offsetWidth
const cdHeight = cd.offsetHeight


const app = {
    currentIndex: 1, 
    isPlaying: false,
    isRandom: false,
    isReplay: false,
    isShowOption: false,
    hasPlayed: [],
    songs:
    [
        {
            id: 1,
            title: 'Stuck With You',
            author: 'Ariana Grande',
            thumbnail: './assets/img/StuckWithYou.png',
            path: './assets/music/StuckWithYou.mp3',
        },
        {
            id: 2,
            title: 'Anti Hero',
            author: 'Taylor Swift',
            thumbnail: './assets/img/AntiHero.png',
            path: './assets/music/AntiHero.mp3',
        },
        {
            id: 3,
            title: 'Faded',
            author: 'Alan Walker',
            thumbnail: './assets/img/Faded.png',
            path: './assets/music/Faded.mp3',
        },
        {
            id: 4,
            title: 'Believer',
            author: 'Imagine Dragon',
            thumbnail: './assets/img/Believer.jpg',
            path: './assets/music/Believer.mp3',
        },
        {
            id: 5,
            title: 'Color Code',
            author: 'PIKASONIC',
            thumbnail: './assets/img/ColorCode.jpg',
            path: './assets/music/ColorCode.mp3',
        },
        {
            id: 6,
            title: 'Endless Hanabi',
            author: 'PIKASONIC',
            thumbnail: './assets/img/EndlessHanabi.jpg',
            path: './assets/music/EndlessHanabi.mp3',
        },
        {
            id: 7,
            title: 'Shelter',
            author: 'Porter Robinson & Madeon',
            thumbnail: './assets/img/Shelter.jpeg',
            path: './assets/music/Shelter.mp3',
        },
        {
            id: 8,
            title: 'Mr.Brightside',
            author: 'Porter Robinson & Madeon',
            thumbnail: './assets/img/MrBrightSide.jpg',
            path: './assets/music/MrBrightSide.mp3',
        },
    ],
    

    render: function renderSongs() {
        var htmls = this.songs.map((song,index) => {
            return `<div class="song ${index === this.currentIndex? 'song-active' : ''}" data-index=${index}>
            <div class="thumb" style="background-image: url('${song.thumbnail}')">
            </div>
            <div class="body">
                <h3 class="title"> ${song.title} </h3>
                <i class="author"> ${song.author} </i>
            </div>
            <div class="option ti-more">
                <ul class="option-menu">
                    <li class="delete-button"> xóa </li>
                </ul>
            </div>
        </div>`
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.title
        cdThumb.style.backgroundImage = `url('${this.currentSong.thumbnail}')`
        audio.src = this.currentSong.path
    },
    renderOptionMenu: function() {

    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    replaySong: function() {
        this.currentIndex = this.currentIndex
        audio.play()
    },
    randomSong: function() {
        let newNum
        if(this.hasPlayed.length >= this.songs.length) {
            this.hasPlayed = []
        }

        do {
            newNum = Math.floor(Math.random() * this.songs.length)
        } while (this.hasPlayed.includes(newNum))

        this.hasPlayed.push(newNum)
        this.currentIndex = newNum
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        $('.song.song-active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        })

    },
    handleEvents: function() {
        const _this = this;

        //xử lý quay đĩa CD
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()

        //xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            const newCdHeight = cdHeight - scrollTop

            cd.style.width = newCdWidth > 0? newCdWidth + 'px' : 0;
            cd.style.height = newCdHeight > 0? newCdHeight + 'px' : 0;
        }


        //xu ly thao tac bam play
        playButton.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play() 
            }
            
        }

        //xu ly khi dang play
        audio.onplay = function() {
            _this.isPlaying = true;
            playButton.classList.add('ti-control-pause')
            cdThumbAnimate.play()
        }

        //xử lý khi đang pause
        audio.onpause = function() {
            _this.isPlaying = false;
            playButton.classList.remove('ti-control-pause')
            cdThumbAnimate.pause()
        }

        //xử lý update thanh progress khi đang play/pause
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100
                progress.value = progressPercent
            }
        }

        //xử lý tua bài hát
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //xử lý bấm nút bài hát kế
        nextBtn.onclick = function() {
            _this.isRandom? _this.randomSong() : _this.nextSong()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //xử lý bấm nút về bài hát trước
        prevBtn.onclick = function() {
            _this.isRandom? _this.randomSong() : _this.prevSong()
            audio.play()
            _this.render()  
            _this.scrollToActiveSong()
        }

        
        //xử lý lúc bài hát end sẽ nhảy bài
        audio.onended = function() {
            if(_this.isReplay) {
                _this.replaySong()
            } else {
                nextBtn.click()
            }
        }
        
        //xử lý bật/tắt shuffle
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //xử lý bấm nút replay
        replayBtn.onclick = function() {
            _this.isReplay = !_this.isReplay;
            replayBtn.classList.toggle('active', _this.isReplay)
        }

        //xử lý chọn bài hát
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.song-active)')
            const optionBtn = e.target.closest('.option')
            const optionMenu = e.target.querySelector('.option-menu')
            
            if(songNode && !optionBtn) {
                const dataIndex = Number(songNode.dataset.index) //GetAttribute trả về kiểu dữ liệu chuỗi nên phải chuyển thành kiểu số
                _this.currentIndex = dataIndex
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
            
            //xử lý khi chọn option
            if(optionBtn) {
                // _this.isShowOption = !_this.isShowOption
                // $$('.option').forEach((option) => {
                //     option.classList.remove('option-active')
                // })
                // optionBtn.classList.toggle('option-active', _this.isShowOption)
            }
        }

        //xử lý khi bấm vào nút volume
        volumeBtn.onclick = function() {
            const scroller = $('.scroller')
            scroller.classList.toggle('active')
        }

        // body.onclick = function(e) {
        //     e.stopPropagation();
        //     const scroller = $('.scroller')
        //     scroller.classList.remove('active')
        // }
        //xử lý điều chỉnh volume âm lưọng
        volumeScroller.oninput = function(e) {
            audio.volume = e.target.value / 100
        }

    },

    start: function() {
        this.defineProperties()
        this.loadCurrentSong()
        this.handleEvents()
        this.render()
    }
}

app.start()