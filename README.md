# rack-mini-profiler

This is an opinionated fork of the wonderful 
[MiniProfiler/rack-mini-profiler][0].  Designed for use at [Figma][3], but 
hopefully useful externally!

This fork dramatically simplifies the UI (at the cost of removing many 
features), adds support for recording sampling profiles using [stackprof][1] on 
all requests, and displaying them in an embedded copy of [speedscope][2].

This work was heavily inspired by the work done for a similar use case at Khan 
Academy: [gae_mini_profiler][4], in particular the [work done by 
@chrisklaiber][5] to add an embedded copy of Chrome Developer Tools.


## Screenshots

![Request listing](https://i.imgur.com/emaKo24.png)
![Speedscope](https://user-images.githubusercontent.com/150329/42205346-14a4d6f4-7e59-11e8-9e14-bb7d922c1aec.png)

## Licence

The MIT License (MIT)

Copyright (c) 2013 Sam Saffron

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[0]: https://github.com/MiniProfiler/rack-mini-profiler
[1]: https://github.com/tmm1/stackprof
[2]: https://github.com/jlfwong/speedscope
[3]: https://www.figma.com/
[4]: https://github.com/Khan/gae_mini_profiler
[5]: https://github.com/Khan/gae_mini_profiler/commit/cee9b20e0e62134672305ea4d5054848dd6322aa
