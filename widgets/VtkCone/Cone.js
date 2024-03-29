import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';

export default class Cone {
    constructor() {
        const renderWindow = vtkRenderWindow.newInstance();
        const renderer = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
        renderWindow.addRenderer(renderer);

        // ----------------------------------------------------------------------------
        // Simple pipeline ConeSource --> Mapper --> Actor
        // ----------------------------------------------------------------------------

        const coneSource = vtkConeSource.newInstance({ height: 1.0 });

        const mapper = vtkMapper.newInstance();
        mapper.setInputConnection(coneSource.getOutputPort());

        const actor = vtkActor.newInstance();
        actor.setMapper(mapper);

        // ----------------------------------------------------------------------------
        // Add the actor to the renderer and set the camera based on it
        // ----------------------------------------------------------------------------

        renderer.addActor(actor);
        renderer.resetCamera();

        // ----------------------------------------------------------------------------
        // Use OpenGL as the backend to view the all this
        // ----------------------------------------------------------------------------

        const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
        renderWindow.addView(openglRenderWindow);

        this.openglRenderWindow = openglRenderWindow;
    }
    setContainer(container) {
        this.openglRenderWindow.setContainer(container);

        // ----------------------------------------------------------------------------
        // Capture size of the container and set it to the renderWindow
        // ----------------------------------------------------------------------------

        const { width, height } = container.getBoundingClientRect();
        this.openglRenderWindow.setSize(width, height);

        // ----------------------------------------------------------------------------
        // Setup an interactor to handle mouse events
        // ----------------------------------------------------------------------------

        const interactor = vtkRenderWindowInteractor.newInstance();
        interactor.setView(this.openglRenderWindow);
        interactor.initialize();
        interactor.bindEvents(container);

        // ----------------------------------------------------------------------------
        // Setup interactor style to use
        // ----------------------------------------------------------------------------

        interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());
    }
}