/*
        IMPORTANT!

        REPLACE THIS:
        // this.mouse.x = (ev.clientX - pos.left) / scale;
        // this.mouse.y = (ev.clientY - pos.top) / scale;

        WITH THIS:
        this.mouse.x = (ev.pageX - ig.FullscreenHelper.offset[0]) / ig.FullscreenHelper.scale;
        this.mouse.y = (ev.pageY - ig.FullscreenHelper.offset[1]) / ig.FullscreenHelper.scale;

        IN INPUT.js, mousemove function

 */
ig.module(
    'plugins.canvas-css3-scaling'
)
.defines(function(){
FullscreenHelper = ig.Class.extend({
    offset: null,
    scale: null,
    init: function() {
        // Get DOM elements
        this.element = document.getElementById('game');
        this.canvas = this.element.firstElementChild;
        // Original content size
        this.content = [this.canvas.width, this.canvas.height];
        // Mouse move
        this.element.addEventListener('mousemove', this, true);
        // Reflow canvas size/margin on resize
        window.addEventListener('resize', this, false);
        this.reflow();
    },
    reflow: function() {
        // 2d vectors to store various sizes
        var browser = [
            window.innerWidth, window.innerHeight];
        // Minimum scale to fit whole canvas
        var scale = this.scale = Math.min(
            browser[0] / this.content[0],
            browser[1] / this.content[1]);
        // Scaled content size
        var size = [
            this.content[0] * scale, this.content[1] * scale];
        // Offset from top/left
        var offset = this.offset = [
            (browser[0] - size[0]) / 2, (browser[1] - size[1]) / 2];
        // Apply CSS transform
        var rule = "translate(" + offset[0] + "px, " + offset[1] + "px) scale(" + scale + ")";
        this.element.style.transform = rule;
        this.element.style.webkitTransform = rule;
    },
        // Handle all events
    handleEvent: function(evt) {
        if(evt.type == 'resize') {
            // Window resized
            this.reflow();
        }
    }
});
});