define(['modules/api/ReaderApi', 'modules/core/Registry', 'modules/core/ReaderKernel', 'modules/layouts/Layout'], function (api, Registry, Kernel, Layout) {
    return {
        start: function () {
            describe('Registry', function () {
                before(function () {
                    // ...
                });

                describe('#get(key)', function () {
                    it('\'krenel\' should return kernel object', function () {
                        Registry.get('kernel').should.be.instanceOf(Kernel);
                    });
                    it('\'layout\' should exists as instance on Layout interface', function () {
                        Registry.get('layout').should.be.instanceOf(Layout);
                    });
                });

                describe('#set(key, value)', function () {
                    it('set key \'abc\' with value \'xxx123\' and get it', function () {
                        Registry.set('abc', 'xxx123');
                        Registry.get('abc').should.be.equal('xxx123');
                    });
                });
            });
        }
    }

});