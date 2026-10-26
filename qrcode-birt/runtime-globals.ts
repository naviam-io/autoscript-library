/** The root of the Java packages, which Rhino and Nashorn both provide. */
declare var Packages: any;

var runtimeGlobals =Function('return this')() as {
    javaType?: <T>(className: string) => T;
};

/**
 * Looks up a Java class. Nashorn, which runs Maximo's scripts, provides Java.type; Rhino, which runs
 * BIRT report scripts, does not, but reaches the same classes through Packages.
 */
runtimeGlobals.javaType = function javaType<T>(className: string): T {
    if (typeof Java !== 'undefined' && Java.type) {
        return Java.type<any>(className) as T;
    }

    var javaClass = Packages;
    var names = className.split('.');
    for (var i = 0; i < names.length; i++) {
        javaClass = javaClass[names[i]];
    }
    return javaClass as T;
};
