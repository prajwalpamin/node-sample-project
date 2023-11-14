const sonarqubeScanner =  require('sonarqube-scanner');
sonarqubeScanner(
    {
        serverUrl:  'http://35.207.255.130:9000',
        options : {
            'sonar.login':'sqp_b0d3504aa59e77fa0ea9018820f80687d32defd7',
            'sonar.sources':  '.',
            // 'sonar.tests':  '.',
            'sonar.projectKey':'node-sonar',
            // 'sonar.inclusions'  :  '**', // Entry point of your code
            // 'sonar.test.inclusions':  'src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx',
            // 'sonar.javascript.lcov.reportPaths':  'coverage/lcov.info',
            //'sonar.testExecutionReportPaths':  'coverage/test-reporter.xml',
        }
    }, () => {});
