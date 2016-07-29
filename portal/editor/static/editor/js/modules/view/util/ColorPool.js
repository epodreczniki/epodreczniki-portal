define(['declare'], function (declare) {
    return declare({
        instance: {
            pointer: 0,
            nextColor: function() {
                var color = this._static.colors[this.pointer];
                this.pointer++;
                if(this.pointer >= this._static.colors.length){
                    this.pointer = 0;
                }
                return color;
            }


        },
        'static': {
            colors: [
                '#faded3',
                '#CCFF66',
                '#CC66CC',
                '#993333',
                '#66CCFF',
                '#336666',
                '#0033CC'
            ],
            defaultColor: '#fffefe'
        }
    });
});
