from reactopya import Component


class VtkCone(Component):
    def __init__(self):
        super().__init__()

    def javascript_state_changed(self, prev_state, state):
        self.set_python_state(dict(status='running', status_message='Running'))

        self.set_python_state(dict(
            status='finished'
        ))