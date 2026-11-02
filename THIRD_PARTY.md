# Native animation conversion

The header and archival intro use the original Hong Xuan artwork. Their vector drawing commands and frame transforms were converted offline with [JPEXS FFDec 26.4.0](https://github.com/jindrapetrik/jpexs-decompiler).

The generated Canvas drawing helpers retain the upstream attribution. The delivered animation uses standard Canvas 2D APIs and requestAnimationFrame. It does not load or interpret SWF, ActionScript, Ruffle or an Adobe plugin. FFDec and Java are optional one-time conversion tools and are not required to install, build, develop or run this project.

The original loading/preloader scene is skipped. The main header repeats frames 35–545 at 30fps (the original `start` loop); the archive intro repeats 145 frames at 12fps. Canvas and Flash renderers can differ slightly in antialiasing/blending.
