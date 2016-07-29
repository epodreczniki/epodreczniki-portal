define(['modules/core/Registry',
    'modules/core/ReaderKernel',
    'modules/layouts/uwr/UwrLayout'], function (Registry, ReaderKernel, DefaultLayout) {

    if (!Registry.get('kernel')) {
        var kernel = new ReaderKernel();
        Registry.set('kernel', kernel);
    }

    if (!Registry.get('layout')) {
        var defaultLayout = new DefaultLayout({kernel: kernel});
        Registry.set('layout', defaultLayout);
    }
});
